// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { I18nManager, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, View } from 'react-native';
import { Divider, IconButton, TextInput, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { increment, ref, update } from 'firebase/database';
import { useDispatch, useSelector } from 'react-redux';
import EventSource from 'react-native-sse';
import _ from 'lodash';
// ------------------------------------------------------------ //
// ------------------------ COMPONENTS ------------------------ //
// ------------------------------------------------------------ //
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
import RegularButton from 'app/src/components/Buttons/Regular';
// ------------------------------------------------------------ //
// ------------------------- COMPONENT ------------------------ //
// ------------------------------------------------------------ //
const _t = (key, options) => t(`chat.${key}`, options);

const ChatScreen = ({ route, navigation }) => {
  // --------------------------------------------------------- //
  // ------------------------ REDUX -------------------------- //
  const dispatch = useDispatch();
  const updateMessages = useCallback(payload => dispatch(setMessages(payload)), [dispatch]);
  const updateMessageAnswer = useCallback(payload => dispatch(updateAnswer(payload)), [dispatch]);
  const updateConversationId = useCallback(payload => dispatch(setConversationId(payload)), [dispatch]);

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

  const [value, setValue] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [openUsageModal, setOpenUsageModal] = useState(false);

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
      Keyboard.dismiss();

      if (messagesCount >= dailyMessagesLimit && !ownedSubscription) {
        setOpenUsageModal(true);
        return;
      }

      setLoading(true);
      let id = conversationId ?? null;

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

      let newContent = '';

      const url = `${BASE_URL}${Endpoints.TEXT_COMPLETIONS_TURBO}`;

      // Parameters to pass to the API
      const data = {
        model: 'gpt-3.5-turbo',
        messages: [...apiMessages, { content: message, role: 'user' }],
        temperature: 0.66,
        top_p: 1.0,
        max_tokens: 1000,
        stream: true,
        n: 1,
      };

      // Initiate the requests
      es.current = new EventSource(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        method: 'POST',
        body: JSON.stringify(data),
        pollingInterval: 5000,
      });

      // Listen the server until the last piece of text
      const listener = async event => {
        if (event.type === 'open') {
          console.info('Opened an SSE connection');

          // Clear the prompt
          setValue('');
        } else if (event.type === 'close') {
          console.info('Closed SSE connection');
          setLoading(false);
          // Update the last message in the state
          updateMessageAnswer(newContent);
          // Update answer in local storage before closing
          updateAnswerInDb(newContent, messageId);
        } else if (event.type === 'message') {
          if (event.data !== '[DONE]') {
            // get every piece of text
            const parsedData = JSON.parse(event.data);
            const delta = parsedData.choices[0].delta;

            // Check if is the last text to close the events request
            const finish_reason = parsedData.choices[0].finish_reason;

            if (finish_reason === 'stop') {
              // Update answer in local storage
              updateAnswerInDb(newContent, messageId);

              // Update the message count and last sent date in storage
              updateMessageCount();

              // Close event source to prevent memory leak
              es.current.close();
            } else {
              if (delta && delta.content) {
                // Update content with new data
                newContent += delta.content;

                // Continuously update the last message in the state with new piece of data
                updateMessageAnswer(newContent);
              }
            }
          } else {
            es.current.close();
          }
        } else if (event.type === 'error') {
          console.error('Event Source Connection error:', event.message);
        } else if (event.type === 'exception') {
          console.error('Event Source Error (Exception):', event.message, event.error);
        }
      };

      // Add listeners
      es.current.addEventListener('open', listener);
      es.current.addEventListener('message', listener);
      es.current.addEventListener('close', listener);
      es.current.addEventListener('error', listener);

      return () => {
        // Remove listeners and close event source to prevent memory leak
        es.current.removeAllEventListeners();
        es.current.close();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiMessages, conversationId, dailyMessagesLimit, ownedSubscription, messagesCount],
  );

  const handleStopGeneration = useCallback(() => {
    es.current && es.current.close();
    setLoading(false);
  }, []);

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
        value={value}
        setValue={setValue}
        handleSubmit={handleSubmitPrompt}
        isAssistant={isAssistantChat}
        questions={assistant?.questions[language]}
      />
    ),
    [assistant?.questions, handleSubmitPrompt, isAssistantChat, language, value],
  );

  const renderConversation = useMemo(
    () => <Conversation data={messages} loading={loadingMsgs} generating={loading} />,
    [loading, loadingMsgs, messages],
  );

  const renderMessageInputField = useMemo(
    () => (
      <SafeAreaView>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : 'height'} keyboardVerticalOffset={100}>
          <TextInput
            multiline
            value={value}
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
                disabled={_.isEmpty(value)}
                iconColor={theme.colors.secondary}
                onPress={() => handleSubmitPrompt(value)}
                style={{ transform: isRTL ? [{ scaleX: -1 }] : undefined }}
              />
            }
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    ),
    [handleSubmitPrompt, handleValueChange, styles.input, styles.underline, theme.colors.secondary, value],
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
    <View style={styles.container} onPress={() => Keyboard.dismiss()}>
      <View style={styles.flex1}>
        {_.isEmpty(messages) ? renderIntro : renderConversation}
        {loading ? renderStopButn : null}
      </View>

      <Divider style={styles.divider} />

      {renderMessageInputField}
    </View>
  );
};

export default ChatScreen;
