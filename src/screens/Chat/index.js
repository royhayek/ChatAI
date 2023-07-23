import _ from 'lodash';
import { Keyboard, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Divider, TextInput, useTheme } from 'react-native-paper';
import {
  addConversation,
  addMessage,
  getConversation,
  getMessagesByConversation,
  updateLocalAnswer,
} from 'app/src/data/localdb';
import Conversation from './components/Conversation';
import Intro from './components/Intro';
import { t } from '../../config/i18n';
import makeStyles from './styles';
import { generateResponse } from 'app/src/config/openAI';
import useChatStream from '@magicul/react-chat-stream';
import { API_KEY } from '@env';
import EventSource from 'react-native-sse';

const _t = (key, options) => t(`chat.${key}`, options);

const DEFAULT_OPENAI_MODEL = {
  name: 'Default (GPT-3.5)',
  id: 'gpt-3.5-turbo',
  available: true,
};

const ChatScreen = ({ route }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const [currentConversation, setCurrentConversation] = useState(route?.params?.conversation?.id ?? null);
  const [storedValues, setStoredValues] = useState([]);
  const [value, setValue] = useState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    currentConversation && getMessagesByConversation(currentConversation).then(m => setMessages(m));
  }, [currentConversation]);

  useEffect(() => {
    route?.params?.conversation && setCurrentConversation(route.params.conversation.id);
  }, [route]);

  const handleValueChange = useCallback(text => {
    setValue(text);
  }, []);

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

  const handleSubmitPrompt = async message => {
    setLoading(true);
    let conversationId = currentConversation ?? null;

    // Create a new conversation if it doesn't exist
    const existingMessages = await getMessagesByConversation(currentConversation);
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
    const currentMessages = await getMessagesByConversation(currentConversation);
    currentMessages.push(newMessageModel);
    setMessages(currentMessages);

    // Save inital message in local storage
    const messageId = await createMessage(newMessageModel);
    setStoredValues(values => [...values, { content: message, role: 'user' }]);

    let newContent = '';

    let url = 'https://api.openai.com/v1/chat/completions';

    const msgs = [...storedValues, { content: value, role: 'user' }];
    console.debug('msgs', msgs);

    // Parameters to pass to the API
    let data = {
      model: 'gpt-3.5-turbo',
      messages: [...storedValues, { content: value, role: 'user' }],
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
      pollingInterval: 25000,
    });

    // Listen the server until the last piece of text
    const listener = async event => {
      if (event.type === 'open') {
        console.debug('Opened an SSE connection');
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

            setStoredValues(values => [...values, { content: newContent, role: 'system' }]);

            // Update current conversation
            setCurrentConversation(conversationId);

            // Clear the prompt
            setValue('');

            setLoading(false);

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
        console.error('Connection error:', event.message);
      } else if (event.type === 'exception') {
        console.error('Error:', event.message, event.error);
      }
    };

    // Add listener
    es.addEventListener('open', listener);
    es.addEventListener('message', listener);
    es.addEventListener('error', listener);

    return () => {
      es.removeAllEventListeners();
      es.close();
    };
  };

  return (
    <View style={styles.container}>
      {_.isEmpty(messages) ? (
        <Intro value={value} setValue={setValue} setData={setStoredValues} />
      ) : (
        <Conversation data={messages} />
      )}
      <Divider style={styles.divider} />
      <TextInput
        multiline
        value={value}
        mode="outlined"
        style={styles.input}
        verticalAlign="middle"
        outlineColor="transparent"
        onSubmitEditing={Keyboard.dismiss}
        onChangeText={handleValueChange}
        activeOutlineColor="transparent"
        returnKeyType="send"
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
          />
        }
      />
    </View>
  );
};

export default ChatScreen;
