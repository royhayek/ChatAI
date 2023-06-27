import React from 'react';
import { FlatList, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import makeStyles from './styles';

const Conversation = ({ data }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        inverted
        data={data.reverse()}
        renderItem={({ item }) => {
          return (
            <View style={styles.question}>
              <Text variant="labelLarge">{item}</Text>
            </View>
          );
        }}
      />

      <View style={styles.answer}>
        <Text variant="labelLarge" style={{ color: 'white' }}>
          {data[0]}
          {data[0]}
          {data[0]}
          {data[0]}
          {data[0]}
          {data[0]}
        </Text>
      </View>
      {/* <View style={styles.question}>
        <Text variant="labelLarge">{data[0]}</Text>
      </View>
      <View style={styles.answer}>
        <Text variant="labelLarge" style={{ color: 'white' }}>
          {data[0]}
          {data[0]}
          {data[0]}
          {data[0]}
          {data[0]}
          {data[0]}
        </Text>
      </View> */}
    </View>
  );
};

export default Conversation;
