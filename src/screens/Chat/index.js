// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import EventSource from 'react-native-sse';
import _ from 'lodash';
// ------------------------------------------------------------ //
// ------------------------ COMPONENTS ------------------------ //
// ------------------------------------------------------------ //
import { Keyboard, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { Divider, FAB, IconButton, TextInput, useTheme } from 'react-native-paper';
import Conversation from './components/Conversation';
import { Octicons } from '@expo/vector-icons';
import Intro from './components/Intro';
// ------------------------------------------------------------ //
// ------------------------- UTILITIES ------------------------ //
// ------------------------------------------------------------ //
import { addConversation, addMessage, getMessagesByConversation, updateLocalAnswer } from 'app/src/data/localdb';
import { isRTL, t } from '../../config/i18n';
import makeStyles from './styles';
import { API_KEY } from '@env';
import Usage from 'app/src/components/Usage';
import RegularButton from 'app/src/components/Buttons/Regular';
import { useDispatch, useSelector } from 'react-redux';
import { setLastSentDate, setMessagesCount } from 'app/src/redux/slices/appSlice';
import { DAILY_USAGE_LIMIT } from 'app/src/config/constants';

// ------------------------------------------------------------ //
// ------------------------- COMPONENT ------------------------ //
// ------------------------------------------------------------ //
const _t = (key, options) => t(`chat.${key}`, options);

const ChatScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const updateMessagesCount = useCallback(payload => dispatch(setMessagesCount(payload)), [dispatch]);
  const updateLastSentDate = useCallback(payload => dispatch(setLastSentDate(payload)), [dispatch]);

  const messagesCount = useSelector(state => state.app.messagesCount);
  const ownedSubscription = useSelector(state => state.app.ownedSubscription);
  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const theme = useTheme();
  const styles = makeStyles(theme);

  const [currentConversation, setCurrentConversation] = useState(route?.params?.conversation?.id ?? null);
  const [value, setValue] = useState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [openUsageModal, setOpenUsageModal] = useState(false);

  const apiMessages = _.reduce(
    messages,
    (r, v) => {
      return [...r, { content: v.question, role: 'user' }, { content: v.answer, role: 'system' }];
    },
    [],
  );
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- CALLBACKS ----------------------- //
  const handleNewConversation = useCallback(() => {
    setCurrentConversation(null);
    setMessages([]);
    setValue(null);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Chat' }],
    });
  }, [navigation]);

  const handleValueChange = useCallback(text => setValue(text), []);

  const refreshMessages = useCallback(() => {
    setLoadingMsgs(true);
    getMessagesByConversation(currentConversation)
      .then(m => !_.isEqual(m, messages) && setMessages(m))
      .finally(() => setLoadingMsgs(false));
  }, [messages, currentConversation]);

  const createConversation = async message => {
    const newConversation = {
      title: message,
      createdAt: new Date().toLocaleString(),
    };
    return await addConversation(newConversation);
  };

  const updateAnswer = async (message, messageId) => {
    await updateLocalAnswer({ messageId: messageId, answer: message });
  };

  const createMessage = async messageModel => {
    return await addMessage(messageModel);
  };

  // Function to update the message count and last sent date in storage and redux
  const updateMessageCount = async () => {
    const today = new Date().toISOString().split('T')[0];

    try {
      await SecureStore.setItemAsync('lastSentDate', today);
      await SecureStore.setItemAsync('messageCount', (messagesCount + 1).toString());
      updateMessagesCount(messagesCount + 1);
      updateLastSentDate(today);
    } catch (error) {
      console.error('Error updating message count:', error);
    }
  };

  const handleSubmitPrompt = async message => {
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
    setMessages(currentMessages);

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
    const es = new EventSource(url, {
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
      } else if (event.type === 'message') {
        if (event.data !== '[DONE]') {
          // get every piece of text
          const data = JSON.parse(event.data);
          const delta = data.choices[0].delta;

          // Check if is the last text to close the events request
          const finish_reason = data.choices[0].finish_reason;

          if (finish_reason === 'stop') {
            // Update answer in local storage
            updateAnswer(newContent, messageId);

            // Update current conversation
            setCurrentConversation(conversationId);

            // Stop the loading placeholder
            setLoading(false);

            // Update the message count and last sent date in storage
            updateMessageCount();

            // Close event source to prevent memory leak
            es.close();
          } else {
            if (delta && delta.content) {
              // Update content with new data
              newContent += delta.content;

              // Continuously update the last message in the state with new piece of data
              setMessages(previousMessages => {
                // Get the last array
                const last = [...previousMessages];

                // Update the list
                last[previousMessages.length - 1].answer = newContent;

                // Return the new array
                return last;
              });
            }
          }
        } else {
          es.close();
        }
      } else if (event.type === 'error') {
        console.error('Event Source Connection error:', event.message);
      } else if (event.type === 'exception') {
        console.error('Event Source Error (Exception):', event.message, event.error);
      }
    };

    // Add listeners
    es.addEventListener('open', listener);
    es.addEventListener('message', listener);
    es.addEventListener('close', listener);
    es.addEventListener('error', listener);

    return () => {
      // Remove listeners and close event source to prevent memory leak
      es.removeAllEventListeners();
      es.close();
    };
  };
  // ---------------------- /CALLBACKS ----------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ------------------------ EFFECTS ------------------------ //
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => !ownedSubscription && <Usage open={openUsageModal} onClose={setOpenUsageModal} radius={14} />,
      headerRight: () =>
        currentConversation && (
          <IconButton
            size={22}
            onPress={handleNewConversation}
            icon={props => <Octicons name="plus" size={22} color={theme.dark ? 'white' : 'black'} />}
          />
        ),
    });
  }, [openUsageModal, navigation, currentConversation, ownedSubscription, setOpenUsageModal]);

  useEffect(() => {
    route?.params?.conversation && setCurrentConversation(route.params.conversation.id);
  }, [route]);

  useEffect(() => {
    currentConversation && refreshMessages();
  }, [currentConversation]);
  // ----------------------- /EFFECTS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- RENDERERS ----------------------- //
  return (
    <View style={styles.container} onPress={() => Keyboard.dismiss()}>
      <View style={{ flex: 1 }}>
        {_.isEmpty(messages) ? (
          <Intro value={value} setValue={setValue} handleSubmit={handleSubmitPrompt} />
        ) : (
          <Conversation data={messages} loading={loadingMsgs} />
        )}

        {/* {loading && (
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center' }}>
            <RegularButton
              title="Stop"
              leftIcon={<Ionicons name="md-stop" size={18} color={theme.colors.white} />}
              onPress={() => null}
            />
          </View>
        )} */}
      </View>
      <Divider style={styles.divider} />
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
          underlineStyle={{ display: 'none' }}
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
    </View>
  );
};

export default ChatScreen;
