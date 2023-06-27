import React, { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Divider, Text, TextInput, useTheme } from 'react-native-paper';
import { EXAMPLES } from './config';
import makeStyles from './styles';
import Conversation from './components/Conversation';
import Intro from './components/Intro';

const ChatScreen = ({ route }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const [data, setData] = useState([]);
  const [value, setValue] = useState(route?.params?.value ?? null);

  useEffect(() => {
    const routeValue = route?.params?.value;
    if (routeValue) {
      setValue(routeValue);
      setData(cur => [...cur, routeValue]);
    }
  }, [route]);

  const handleValueChange = useCallback(text => {
    setValue(text);
  }, []);

  const handleSendPress = useCallback(
    text => {
      console.debug('hanndleSendPress is being called');
      setData(cur => [...cur, text]);
    },
    [value],
  );

  console.debug('data', data);

  return (
    <View style={styles.container}>
      {_.isEmpty(data) ? <Intro value={value} setValue={setValue} setData={setData} /> : <Conversation data={data} />}
      <Divider style={styles.divider} />
      <TextInput
        multiline
        value={value}
        mode="outlined"
        style={styles.input}
        verticalAlign="middle"
        onChangeText={handleValueChange}
        outlineColor="transparent"
        placeholder="Send a message"
        activeOutlineColor="transparent"
        underlineStyle={{ display: 'none' }}
        placeholderTextColor={theme.colors.secondary}
        right={
          <TextInput.Icon
            centered
            icon="send"
            disabled={_.isEmpty(value)}
            iconColor={theme.colors.secondary}
            onPress={() => handleSendPress(value)}
          />
        }
      />
    </View>
  );
};

export default ChatScreen;
