import { createSelector } from '@reduxjs/toolkit';

// ------------- App Selectors ------------- //
export const appState = state => state.app;

export const getConfiguration = createSelector(appState, data => data.config);

// ------------- Chat Selectors ------------- //
export const chatState = state => state.chat;

export const getChatMessages = createSelector(chatState, data => data.messages);
