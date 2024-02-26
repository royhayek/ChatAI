// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { I18nManager, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Divider, IconButton, TextInput, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { increment, ref, update } from 'firebase/database';
import { useDispatch, useSelector } from 'react-redux';
import EventSource from 'react-native-sse';
import _ from 'lodash';
// ------------------------------------------------------------ //
// ------------------------ COMPONENTS ------------------------ //
// ------------------------------------------------------------ //
import RegularButton from 'app/src/components/Buttons/Regular';
import BackButton from 'app/src/components/Buttons/Back';
import Conversation from './components/Conversation';
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import Usage from 'app/src/components/Usage';
import Intro from './components/Intro';
// ------------------------------------------------------------ //
// ------------------------- UTILITIES ------------------------ //
// ------------------------------------------------------------ //
import { getChatMessages, getConfiguration, getConversationId, getLanguage, getMessagesCount, getOwnedSubscription } from 'app/src/redux/selectors';
import { addConversation, addMessage, getMessagesByConversation, updateLocalAnswer } from 'app/src/data/localdb';
import { setConversationId, setMessages, updateAnswer } from 'app/src/redux/slices/chatSlice';
import { Endpoints } from 'app/src/config/constants';
import { FIREBASE_DB } from 'app/firebaseConfig';
import { ASSISTANTS } from '../Assistants/data';
import { isRTL, t } from '../../config/i18n';
import { BASE_URL, API_KEY } from '@env';
import makeStyles from './styles';
// ------------------------------------------------------------ //
// ------------------------- COMPONENT ------------------------ //
// ------------------------------------------------------------ //
const _t = (key, options) => t(`chat.${key}`, options);

const ChatScreen = ({ route, navigation }) => {
  // --------------------------------------------------------- //
  // ------------------------ REDUX -------------------------- //
  const dispatch = useDispatch();
  const updateConversationId = useCallback(payload => dispatch(setConversationId(payload)), [dispatch]);
  const updateMessageAnswer = useCallback(payload => dispatch(updateAnswer(payload)), [dispatch]);
  const updateMessages = useCallback(payload => dispatch(setMessages(payload)), [dispatch]);

  const ownedSubscription = useSelector(getOwnedSubscription);
  const conversationId = useSelector(getConversationId);
  const messagesCount = useSelector(getMessagesCount);
  const messages = useSelector(getChatMessages);
  const config = useSelector(getConfiguration);
  // ----------------------- /REDUX -------------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const theme = useTheme();
  const styles = makeStyles(theme);

  const es = useRef();

  const [openUsageModal, setOpenUsageModal] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [valuee, setValue] = useState();

  const abortControllerRef = useRef(null);

  const routeParams = route.params;
  const isAssistantChat = _.has(routeParams, 'id') && route.params.fromAssistants;
  const assistant = _.find(ASSISTANTS, { id: routeParams?.id });
  const dailyMessagesLimit = config?.other?.dailyMessagesLimit;
  const isArabic = I18nManager.isRTL && Platform.OS === 'android';
  const language = useSelector(getLanguage);

  const apiMessages = useMemo(
    () =>
      _.reduce(
        messages,
        (r, v) => {
          return [...r, { content: v.question, role: 'user' }, { content: v.answer, role: 'system' }];
        },
        [],
      ),
    [messages],
  );
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- CALLBACKS ----------------------- //
  const handleNewConversation = useCallback(() => {
    updateConversationId(null);
    updateMessages([]);
    setValue(null);
  }, [updateConversationId, updateMessages]);

  const handleValueChange = useCallback(text => setValue(text), []);

  const refreshMessages = useCallback(() => {
    !conversationId && setLoadingMsgs(true);
    getMessagesByConversation(conversationId)
      .then(m => !_.isEqual(m, messages) && updateMessages(_.reverse(m)))
      .finally(() => setLoadingMsgs(false));
  }, [conversationId, messages, updateMessages]);

  const createConversation = async message => {
    const newConversation = {
      title: message,
      assistant: assistant?.name[language],
      createdAt: new Date().toLocaleString(),
    };
    return await addConversation(newConversation);
  };

  const updateAnswerInDb = async (message, messageId) => {
    await updateLocalAnswer({ messageId: messageId, answer: message });
  };

  const createMessage = async messageModel => {
    return await addMessage(messageModel);
  };

  // Function to update the message count and last sent date in storage and redux
  const updateMessageCount = useCallback(async () => {
    try {
      // Update message count and lastMessageDate in Firebase
      let id = await AsyncStorage.getItem('deviceUUID');
      const today = new Date().toISOString().split('T')[0];

      const updates = {};
      updates[`users/${id}/messagesCount`] = increment(1);
      updates[`users/${id}/lastMessageDate`] = today;
      update(ref(FIREBASE_DB), updates);
    } catch (error) {
      console.error('Error updating message count:', error);
    }
  }, []);

  const handleSubmitPrompt = useCallback(
    async message => {
      let newContent = '';

      Keyboard.dismiss();
      if (messagesCount >= dailyMessagesLimit && !ownedSubscription) {
        setOpenUsageModal(true);
        return;
      }

      setLoading(true);
      let id = conversationId ?? null;

      // Create a new abort controller instance for this fetch
      abortControllerRef.current = new AbortController();

      // Create a new conversation if it doesn't exist
      const existingMessages = conversationId ? await getMessagesByConversation(conversationId) : [];
      if (existingMessages.length === 0) {
        id = await createConversation(message);
      }
      updateConversationId(id);

      const newMessageModel = {
        question: message,
        answer: '...',
        conversationId: id,
        createdAt: new Date().toLocaleString(),
      };

      // Add the message to existing conversation
      const currentMessages = conversationId ? await getMessagesByConversation(conversationId) : [];
      currentMessages.push(newMessageModel);
      updateMessages(_.reverse(currentMessages));

      // Save inital message in local storage
      const messageId = await createMessage(newMessageModel);

      const url = `${BASE_URL}${Endpoints.TEXT_COMPLETIONS_TURBO}`;

      // Parameters to pass to the API
      const data = {
        model: 'gpt-4',
        messages: [...apiMessages, { content: message, role: 'user' }],
        temperature: 0.7,
        stream: true,
      };

      fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        reactNative: { textStreaming: true },
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      })
        .then(response => response.body)
        .then(async stream => {
          const reader = stream.getReader();
          let decoder = new TextDecoder();
          let contentBuffer = '';

          const processStream = ({ done, value }) => {
            if (done) {
              console.info('[handleSubmitPrompt] :: Done reading the stream');
              setLoading(false);
              updateMessageAnswer(newContent);
              updateAnswerInDb(newContent, messageId);
              updateMessageCount();
              return;
            }

            // Decode the stream chunk
            const chunk = decoder.decode(value, { stream: true });
            contentBuffer += chunk;

            // Process each line in the buffer
            let lines = contentBuffer.split('\n');
            // Handle any incomplete line by pushing it back to the buffer
            contentBuffer = lines.pop();

            lines.forEach(line => {
              if (line.startsWith('data: ')) {
                const parsedData = JSON.parse(line.replace('data: ', ''));
                if (parsedData.choices && parsedData.choices[0] && parsedData.choices[0].delta && parsedData.choices[0].delta.content) {
                  const content = parsedData.choices[0].delta.content;

                  newContent += content;

                  // Continuously update the last message in the state with new piece of data
                  updateMessageAnswer(newContent);
                } else if (
                  parsedData.choices &&
                  parsedData.choices[0] &&
                  parsedData.choices[0].finish_reason &&
                  _.isEqual(parsedData.choices[0].finish_reason, 'stop')
                ) {
                  console.info('[handleSubmitPrompt] :: Stopped reading the stream');
                  updateAnswerInDb(newContent, messageId);
                  updateMessageCount();
                  setLoading(false);
                  setValue('');
                }
              }
            });

            // Continue reading the stream
            reader
              .read()
              .then(processStream)
              .catch(error => {
                console.info('[handleSubmitPrompt] :: Fetch aborted');
                if (error.name === 'AbortError') {
                  setLoading(false);
                  updateMessageAnswer(newContent);
                  updateAnswerInDb(newContent, messageId);
                } else {
                  console.info('Stream reading error:', error);
                }
              });
          };

          // Start reading the stream
          reader
            .read()
            .then(processStream)
            .catch(error => {
              console.error('Initial read error', error);
              setLoading(false);
            });
        })
        .catch(error => {
          console.info('Fetch aborted', error);
          setLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiMessages, conversationId, dailyMessagesLimit, ownedSubscription, messagesCount],
  );

  const handleStopGeneration = useCallback(() => {
    abortControllerRef.current && abortControllerRef.current.abort();
    setValue('');
    setLoading(false);
  }, [abortControllerRef]);

  const renderUsagePie = useMemo(
    () => !ownedSubscription && <Usage open={openUsageModal} onClose={setOpenUsageModal} radius={14} />,
    [openUsageModal, ownedSubscription],
  );

  const renderNewIcon = useCallback(
    props => <Octicons name="plus" size={22} color={theme.dark ? theme.colors.white : theme.colors.black} />,
    [theme.colors.black, theme.colors.white, theme.dark],
  );

  const renderNewConvoButton = useMemo(
    () => conversationId && <IconButton size={22} onPress={handleNewConversation} icon={renderNewIcon} />,
    [conversationId, handleNewConversation, renderNewIcon],
  );

  const renderHeaderLeft = useCallback(() => (isAssistantChat ? <BackButton /> : renderUsagePie), [isAssistantChat, renderUsagePie]);

  const renderHeaderRight = useCallback(
    () =>
      isAssistantChat ? (
        <>
          {renderUsagePie}
          {renderNewConvoButton}
        </>
      ) : (
        renderNewConvoButton
      ),
    [isAssistantChat, renderNewConvoButton, renderUsagePie],
  );
  // ---------------------- /CALLBACKS ----------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ------------------------ EFFECTS ------------------------ //
  useEffect(() => {
    navigation.setOptions({
      headerLeft: isArabic ? renderHeaderRight : renderHeaderLeft,
      headerRight: isArabic ? renderHeaderLeft : renderHeaderRight,
      headerTitle: isAssistantChat && assistant?.name[language],
    });
  }, [assistant?.name, isArabic, isAssistantChat, language, navigation, renderHeaderLeft, renderHeaderRight]);

  useEffect(() => {
    conversationId && refreshMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);
  // ----------------------- /EFFECTS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- RENDERERS ----------------------- //
  const renderIntro = useMemo(
    () => (
      <Intro
        value={valuee}
        setValue={setValue}
        handleSubmit={handleSubmitPrompt}
        isAssistant={isAssistantChat}
        questions={assistant?.questions[language]}
      />
    ),
    [assistant?.questions, handleSubmitPrompt, isAssistantChat, language, valuee],
  );

  const renderConversation = useMemo(
    () => <Conversation data={messages} loading={loadingMsgs} generating={loading} />,
    [loading, loadingMsgs, messages],
  );

  const renderMessageInputField = useMemo(
    () => (
      <TextInput
        multiline
        value={valuee}
        mode="outlined"
        style={styles.input}
        returnKeyType="send"
        verticalAlign="middle"
        outlineColor="transparent"
        onSubmitEditing={Keyboard.dismiss}
        onChangeText={handleValueChange}
        activeOutlineColor="transparent"
        placeholder={_t('send_a_message')}
        underlineStyle={styles.underline}
        placeholderTextColor={theme.colors.secondary}
        right={
          <TextInput.Icon
            centered
            icon="send"
            disabled={_.isEmpty(valuee)}
            iconColor={theme.colors.secondary}
            onPress={() => handleSubmitPrompt(valuee)}
            style={{ transform: isRTL ? [{ scaleX: -1 }] : undefined }}
          />
        }
      />
    ),
    [handleSubmitPrompt, handleValueChange, styles.input, styles.underline, theme.colors.secondary, valuee],
  );

  const renderStopButn = useMemo(
    () => (
      <View style={styles.stopButton}>
        <RegularButton
          title="Stop Generating"
          startIcon={<Ionicons name="md-stop" size={18} color={theme.colors.white} />}
          onPress={handleStopGeneration}
        />
      </View>
    ),
    [handleStopGeneration, styles.stopButton, theme.colors.white],
  );

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.flex1} onPress={() => Keyboard.dismiss()} extraScrollHeight={35}>
        <View style={styles.flex1}>
          {_.isEmpty(messages) ? renderIntro : renderConversation}
          {loading ? renderStopButn : null}
          <Divider style={styles.divider} />
        </View>

        {renderMessageInputField}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ChatScreen;
