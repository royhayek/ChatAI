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
      const last = _.clone(state.messages);
      last[state.messages.length - 1].answer = action.payload;
      state.messages = last;
    },
  },
});

export const { setMessages, updateAnswer, setConversationId, generateTestMessages } = chatSlice.actions;

export default chatSlice.reducer;
