import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import _ from 'lodash';
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { deleteAllConversations, deleteConversation, getConversations } from 'app/src/data/localdb';
import makeStyles from './styles';

const HistoryScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [conversations, setConversations] = useState([]);

  const refreshConversations = useCallback(() => {
    getConversations().then(conversations => setConversations(conversations));
  }, []);

  const handleTextPress = useCallback(conversation => {
    navigation.navigate('Chat', { conversation });
  }, []);

  const handleDeleteHistory = useCallback(async id => {
    await deleteConversation(id).then(() => console.debug('History Deleted Successfully'));
    refreshConversations();
  }, []);

  const handleDeleteAllHistory = useCallback(async id => {
    await deleteAllConversations().then(() => console.debug('History Deleted Successfully'));
    refreshConversations();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          size={22}
          onPress={handleDeleteAllHistory}
          icon={props => <Octicons name="trash" size={22} color={theme.dark ? 'white' : 'black'} />}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    refreshConversations();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        key={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <>
            <TouchableOpacity
              key={index}
              onPress={() => handleTextPress(item)}
              style={{
                flexDirection: 'row',
                marginBottom: 15,
                borderWidth: 1,
                borderRadius: 8,
                padding: 10,
                alignItems: 'center',
                borderColor: theme.colors.secondary,
                backgroundColor: theme.dark ? theme.colors.backdrop : theme.colors.background,
              }}>
              <Ionicons name="md-chatbox-outline" size={20} color={theme.dark ? 'white' : 'black'} />
              <View style={styles.content}>
                <Text variant="labelLarge">{item?.title}</Text>
                <Text variant="bodySmall" style={styles.date}>
                  {item?.createdAt}
                </Text>
              </View>
              <IconButton
                size={17}
                mode="outlined"
                onPress={() => handleDeleteHistory(item?.id)}
                containerColor={theme.colors.background}
                icon={props => <Ionicons name="ios-close" size={20} color={theme.dark ? 'white' : 'black'} />}
              />
            </TouchableOpacity>
          </>
        )}
      />
    </View>
  );
};

export default HistoryScreen;
