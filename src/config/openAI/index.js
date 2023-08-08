import { Configuration, OpenAIApi } from 'openai';
import { API_KEY } from '@env';
import _ from 'lodash';
import {
  addMessage,
  getMessagesByConversation,
  updateLocalAnswer,
} from 'app/src/data/localdb';
import { useRef } from 'react';

const configuration = new Configuration({
  // organization: 'org-qKgEIs4udJUfy2jiLl0PsRgE',
  apiKey: API_KEY,
});

export const openai = new OpenAIApi(configuration);

export const generateResponse = async (
  newQuestion,
  conversationId,
  storedValues,
  setMessages,
) => {
  let completeOptions = {
    model: 'gpt-3.5-turbo',
    messages: [...storedValues, { content: newQuestion, role: 'user' }],
    stream: true,
  };

  try {
    console.debug('completeOptions', completeOptions);

    const response = await openai.createChatCompletion(completeOptions, {
      responseType: 'stream',
    });
    const transformed = response.data
      .replaceAll('data: ', '')
      .replaceAll('\n\n', ',')
      .replaceAll(',[DONE],', '');
    const arrayOfWords = JSON.parse(`[${transformed.trim()}]`);
    console.debug('arrayOfWords', arrayOfWords);

    let result = '';

    const convo = await getMessagesByConversation(conversationId);

    arrayOfWords.forEach(async data => {
      // console.debug('data', data)
      setTimeout(async () => {
        const text = data.choices[0].delta?.content;
        const messages = _.clone(convo);
        messages[0].answer = result;
        setMessages(messages);
        result += text;
        console.debug('result', result);
      }, 2000);

      await updateLocalAnswer({ messageId: convo[0].id, answer: result });
    });
    // for await (const chunk of transformed) {
    //   console.log(chunk.toString());
    //   if (chunk.toString().includes('error')) throw Error(chunk.toString());
    //   if (chunk.toString().includes('DONE')) return;
    //   // Sometimes fail parsing JSON here :/
    //   const data = JSON.parse(chunk.toString().replace('data: ', ''));
    //   if (!data.choices || data.choices.length === 0) continue;
    //   console.debug('data.choices[0].text', data.choices[0].text);
    // }

    // source.addEventListener('message', e => {
    //   if (e.data != '[DONE]') {
    //     let payload = JSON.parse(e.data);
    //     let text = payload.choices[0].text;
    //     if (text != '\n') {
    //       console.log('Text: ' + text);
    //       result = result + text;
    //       console.log('result: ' + result);
    //       // setResult(result);
    //     }
    //   } else {
    //     source.close();
    //   }
    // });

    // source.addEventListener('readystatechange', e => {
    //   if (e.readyState >= 2) {
    //     // setIsLoading(false);
    //     console.debug('isLoading false')
    //   }
    // });

    // source.stream();

    // console.log('response.data', response.data);
    // const stream = response;

    // stream.addEventListener('data', chunk => {
    //   // console.log the buffer value
    //   console.log('chunk: ', chunk);

    //   // this converts the buffer to a string
    //   const payloads = chunk.toString().split('\n\n');

    //   console.log('payloads: ', payloads);

    //   for (const payload of payloads) {
    //     // if string includes '[DONE]'
    //     if (payload.includes('[DONE]')) {
    //       // res.end(); // Close the connection and return
    //       return;
    //     }
    //     if (payload.startsWith('data:')) {
    //       // remove 'data: ' and parse the corresponding object
    //       const data = JSON.parse(payload.replace('data: ', ''));
    //       try {
    //         const text = data.choices[0].delta?.content;
    //         if (text) {
    //           console.log('text: ', text);
    //           // send value of text to the client
    //           // res.write(`${text}`);
    //           // setStoredValues(text);

    //           const newMessageModel = {
    //             answer: text,
    //             conversationId: route?.params?.conversation.id,
    //           };
    //           updateLocalAnswer(newMessageModel);
    //           return text;
    //         }
    //       } catch (error) {
    //         console.log(`Error with JSON.parse and ${payload}.\n${error}`);
    //       }
    //     }
    //   }
    // });
  } catch (error) {
    console.error(error);
  }
};
