// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, View } from 'react-native';
import { Divider, IconButton, TextInput, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import EventSource from 'react-native-sse';
import _ from 'lodash';
// ------------------------------------------------------------ //
// ------------------------ COMPONENTS ------------------------ //
// ------------------------------------------------------------ //
import RegularButton from 'app/src/components/Buttons/Regular';
import BackButton from 'app/src/components/Buttons/Back';
import Conversation from './components/Conversation';
import { Octicons } from '@expo/vector-icons';
import Usage from 'app/src/components/Usage';
import Intro from './components/Intro';
// ------------------------------------------------------------ //
// ------------------------- UTILITIES ------------------------ //
// ------------------------------------------------------------ //
import { addConversation, addMessage, getMessagesByConversation, updateLocalAnswer } from 'app/src/data/localdb';
import { setLastSentDate, setMessagesCount } from 'app/src/redux/slices/appSlice';
import { setMessages, updateAnswer } from 'app/src/redux/slices/chatSlice';
import { DAILY_USAGE_LIMIT } from 'app/src/config/constants';
import { getChatMessages } from 'app/src/redux/selectors';
import { ASSISTANTS } from '../Categories/data';
import { isRTL, t } from '../../config/i18n';
import makeStyles from './styles';
import { API_KEY } from '@env';
// ------------------------------------------------------------ //
// ------------------------- COMPONENT ------------------------ //
// ------------------------------------------------------------ //
const _t = (key, options) => t(`chat.${key}`, options);

const ChatScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const updateMessagesCount = useCallback(payload => dispatch(setMessagesCount(payload)), [dispatch]);
  const updateLastSentDate = useCallback(payload => dispatch(setLastSentDate(payload)), [dispatch]);
  const updateMessages = useCallback(payload => dispatch(setMessages(payload)), [dispatch]);
  const updateMessageAnswer = useCallback(payload => dispatch(updateAnswer(payload)), [dispatch]);

  const messagesCount = useSelector(state => state.app.messagesCount);
  const ownedSubscription = useSelector(state => state.app.ownedSubscription);
  const messages = useSelector(getChatMessages);
  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const theme = useTheme();
  const styles = makeStyles(theme);

  const [currentConversation, setCurrentConversation] = useState(route?.params?.conversation?.id ?? null);
  const [value, setValue] = useState();
  // const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [openUsageModal, setOpenUsageModal] = useState(false);

  const es = useRef();

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

  const routeParams = route.params;
  const isAssistantChat = _.has(routeParams, 'id') && route.params.fromAssistants;
  const assistant = _.find(ASSISTANTS, { id: routeParams?.id });
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- CALLBACKS ----------------------- //
  const handleNewConversation = useCallback(() => {
    setCurrentConversation(null);
    updateMessages([]);
    setValue(null);
  }, [updateMessages]);

  const handleValueChange = useCallback(text => setValue(text), []);

  const refreshMessages = useCallback(() => {
    !currentConversation && setLoadingMsgs(true);
    getMessagesByConversation(currentConversation)
      .then(m => !_.isEqual(m, messages) && updateMessages(m))
      .finally(() => setLoadingMsgs(false));
  }, [currentConversation, messages, updateMessages]);

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
    const today = new Date().toISOString().split('T')[0];

    try {
      await SecureStore.setItemAsync('lastSentDate', today);
      await SecureStore.setItemAsync('messageCount', (messagesCount + 1).toString());
      updateMessagesCount(messagesCount + 1);
      updateLastSentDate(today);
    } catch (error) {
      console.error('Error updating message count:', error);
    }
  }, [messagesCount, updateLastSentDate, updateMessagesCount]);

  const handleSubmitPrompt = useCallback(
    async message => {
      Keyboard.dismiss();

      if (messagesCount >= DAILY_USAGE_LIMIT && !ownedSubscription) {
        setOpenUsageModal(true);
        return;
      }

      setLoading(true);
      let conversationId = currentConversation ?? null;

      // Create a new conversation if it doesn't exist
      const existingMessages = currentConversation ? await getMessagesByConversation(currentConversation) : [];
      if (existingMessages.length === 0) {
        conversationId = await createConversation(message);
      }

      const newMessageModel = {
        question: message,
        answer: '...',
        conversationId,
        createdAt: new Date().toLocaleString(),
      };

      // Add the message to existing conversation
      const currentMessages = currentConversation ? await getMessagesByConversation(currentConversation) : [];
      currentMessages.push(newMessageModel);
      updateMessages(currentMessages);

      // Save inital message in local storage
      const messageId = await createMessage(newMessageModel);

      let newContent = '';

      let url = 'https://api.openai.com/v1/chat/completions';

      // Parameters to pass to the API
      let data = {
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
          // Update current conversation
          setCurrentConversation(conversationId);
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

              // Update current conversation
              setCurrentConversation(conversationId);

              // Stop the loading placeholder
              setLoading(false);

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
    [apiMessages, currentConversation, messagesCount, ownedSubscription, updateMessageAnswer, updateMessageCount, updateMessages],
  );

  const handleStopGeneration = useCallback(() => {
    es.current && es.current.close();
    setLoading(false);
  }, []);

  const renderUsagePie = useMemo(
    () => !ownedSubscription && <Usage open={openUsageModal} onClose={setOpenUsageModal} radius={14} />,
    [openUsageModal, ownedSubscription],
  );

  const renderNewIcon = useCallback(props => <Octicons name="plus" size={22} color={theme.dark ? 'white' : 'black'} />, [theme.dark]);

  const renderNewConvoButton = useMemo(
    () => currentConversation && <IconButton size={22} onPress={handleNewConversation} icon={renderNewIcon} />,
    [currentConversation, handleNewConversation, renderNewIcon],
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
      headerLeft: renderHeaderLeft,
      headerRight: renderHeaderRight,
      headerTitle: isAssistantChat && assistant?.name,
    });
  }, [assistant?.name, isAssistantChat, navigation, renderHeaderLeft, renderHeaderRight]);

  useEffect(() => {
    route?.params?.conversation && setCurrentConversation(route.params.conversation.id);
  }, [route]);

  useEffect(() => {
    currentConversation && refreshMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversation]);
  // ----------------------- /EFFECTS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- RENDERERS ----------------------- //
  const renderIntro = useMemo(
    () => (
      <Intro value={value} setValue={setValue} handleSubmit={handleSubmitPrompt} isAssistant={isAssistantChat} questions={assistant?.questions} />
    ),
    [assistant?.questions, handleSubmitPrompt, isAssistantChat, value],
  );

  const renderConversation = useMemo(() => <Conversation data={messages} loading={loadingMsgs} />, [loadingMsgs, messages]);

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

  const renderLoading = useMemo(
    () => (
      <View style={styles.stopButton}>
        <RegularButton title="Stop" startIcon={<Ionicons name="md-stop" size={18} color={theme.colors.white} />} onPress={handleStopGeneration} />
      </View>
    ),
    [handleStopGeneration, styles.stopButton, theme.colors.white],
  );

  return (
    <View style={styles.container} onPress={() => Keyboard.dismiss()}>
      <View style={styles.flex1}>
        {_.isEmpty(messages) ? renderIntro : renderConversation}
        {loading ? renderLoading : null}
      </View>

      <Divider style={styles.divider} />

      {renderMessageInputField}
    </View>
  );
};

export default ChatScreen;
