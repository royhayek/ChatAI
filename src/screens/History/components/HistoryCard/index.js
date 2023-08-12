// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
// ------------------------------------------------------------ //
// ------------------------- UTILITIES ------------------------ //
// ------------------------------------------------------------ //
import { deleteConversation } from 'app/src/data/localdb';
import makeStyles from './styles';
// ------------------------------------------------------------ //
// ------------------------ COMPONENT ------------------------- //
// ------------------------------------------------------------ //
const HistoryCard = ({ item, index, refresh }) => {
  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const theme = useTheme();
  const styles = makeStyles(theme);
  const navigation = useNavigation();
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ---------------------- CALLBACKS ------------------------ //
  const handleTextPress = useCallback(
    conversation => {
      navigation.navigate('ChatStack', { screen: 'Chat', params: { conversation } });
    },
    [navigation],
  );

  const handleDeleteHistory = useCallback(
    async id => {
      await deleteConversation(id).then(() => console.debug('History Deleted Successfully'));
      refresh(false);
    },
    [refresh],
  );
  // ---------------------- /CALLBACKS ----------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- RENDERERS ----------------------- //
  const renderDeleteIcon = useCallback(
    () => <Ionicons name="ios-close" size={20} color={theme.dark ? theme.colors.white : theme.colors.black} />,
    [theme.colors.black, theme.colors.white, theme.dark],
  );

  return (
    <>
      <TouchableOpacity key={index} onPress={() => handleTextPress(item)} style={styles.container}>
        <Ionicons name="md-chatbox-outline" size={20} color={theme.dark ? theme.colors.white : theme.colors.black} />
        <View style={styles.content}>
          <Text variant="labelLarge" style={styles.title}>
            {item?.title}
          </Text>
          <Text variant="bodySmall" style={styles.date}>
            {item?.createdAt}
          </Text>
        </View>
        <IconButton
          size={17}
          mode="outlined"
          icon={renderDeleteIcon}
          containerColor={theme.colors.background}
          onPress={() => handleDeleteHistory(item?.id)}
        />
      </TouchableOpacity>
    </>
  );
};

export default HistoryCard;
