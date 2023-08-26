// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useCallback } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { useTheme, Text, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
// ------------------------------------------------------------ //
// ------------------------- UTILITIES ------------------------ //
// ------------------------------------------------------------ //
import { setConversationId, setMessages } from 'app/src/redux/slices/chatSlice';
import { getLanguage } from 'app/src/redux/selectors';
import { ASSISTANTS } from './data';
import makeStyles from './styles';
// ------------------------------------------------------------ //
// ------------------------- COMPONENT ------------------------ //
// ------------------------------------------------------------ //
const AssistantsScreen = ({ navigation }) => {
  // --------------------------------------------------------- //
  // ----------------------- REDUX --------------------------- /
  const dispatch = useDispatch();
  const updateMessages = useCallback(payload => dispatch(setMessages(payload)), [dispatch]);
  const updateConversationId = useCallback(payload => dispatch(setConversationId(payload)), [dispatch]);

  const language = useSelector(getLanguage);
  // ----------------------- /REDUX -------------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const theme = useTheme();
  const styles = makeStyles(theme);
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- CALLBACKS ----------------------- //
  const handleAssistantPress = useCallback(
    id => {
      updateConversationId(null);
      updateMessages([]);
      navigation.navigate('Chat', { id, fromAssistants: true });
    },
    [navigation, updateConversationId, updateMessages],
  );
  // ---------------------- /CALLBACKS ----------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- RENDERERS ----------------------- //
  const renderItem = ({ item, index }) => (
    <>
      <TouchableOpacity key={item?.id} style={styles.question} onPress={() => handleAssistantPress(item.id)}>
        <View style={styles.icon}>{item?.icon}</View>
        <View style={styles.flex1}>
          <Text style={styles.name} variant="titleMedium">
            {item.name[language]}
          </Text>
          <Text variant="labelSmall">{item.description[language]}</Text>
        </View>
      </TouchableOpacity>

      {index !== ASSISTANTS.length - 1 && <Divider style={styles.divider} />}
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList data={ASSISTANTS} style={styles.flatList} contentContainerStyle={styles.contentContainer} renderItem={renderItem} />
    </View>
  );
};

export default AssistantsScreen;
