import React, { useCallback } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { useTheme, Text, Divider } from 'react-native-paper';
import { ASSISTANTS } from './data';
import makeStyles from './styles';

const CategoriesScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const handleAssistantPress = useCallback(() => {
    navigation.push('Chat');
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={ASSISTANTS}
        contentContainerStyle={{ paddingBottom: 30 }}
        style={{ marginTop: 16, paddingHorizontal: 16 }}
        renderItem={({ item, index }) => (
          <>
            <TouchableOpacity
              key={item?.id}
              style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}
              onPress={handleAssistantPress}>
              <View style={styles.icon}>{item?.icon}</View>

              <View style={{ flex: 1 }}>
                <Text style={styles.name} variant="titleMedium">
                  {item.name}
                </Text>
                <Text variant="labelSmall">{item.description}</Text>
              </View>
            </TouchableOpacity>
            {index !== ASSISTANTS.length - 1 && <Divider style={{ marginBottom: 10 }} />}
          </>
        )}
      />
    </View>
  );
};

export default CategoriesScreen;
