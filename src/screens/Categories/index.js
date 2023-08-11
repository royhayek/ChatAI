// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useCallback } from 'react';
import { useTheme, Text, Divider } from 'react-native-paper';
import { View, FlatList, TouchableOpacity } from 'react-native';
// ------------------------------------------------------------ //
// ------------------------- UTILITIES ------------------------ //
// ------------------------------------------------------------ //
import { ASSISTANTS } from './data';
import makeStyles from './styles';
// ------------------------------------------------------------ //
// ------------------------- COMPONENT ------------------------ //
// ------------------------------------------------------------ //
const CategoriesScreen = ({ navigation }) => {
  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const theme = useTheme();
  const styles = makeStyles(theme);
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- CALLBACKS ----------------------- //
  const handleAssistantPress = useCallback(id => navigation.navigate('Chat', { id }), [navigation]);
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
            {item.name}
          </Text>
          <Text variant="labelSmall">{item.description}</Text>
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

export default CategoriesScreen;
