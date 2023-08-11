import { createSelector } from '@reduxjs/toolkit';

export const chatState = state => state.chat;

export const getChatMessages = createSelector(chatState, data => data.messages);
