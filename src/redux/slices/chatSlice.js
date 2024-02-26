import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

const initialState = {
  conversationId: null,
  messages: [],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState: initialState,
  reducers: {
    setConversationId: (state, action) => {
      state.conversationId = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    updateAnswer: (state, action) => {
      console.debug('updateAnswer', action.payload, state.messages);
      const first = _.first(state.messages);
      first.answer = action.payload;
      // const last = _.clone(state.messages);
      // last[state.messages.length - 1].answer = action.payload;
      // state.messages = state.messages;
    },
  },
});

export const { setMessages, updateAnswer, setConversationId, generateTestMessages } = chatSlice.actions;

export default chatSlice.reducer;
