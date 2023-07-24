import React, { useRef } from 'react';
import _ from 'lodash';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { ActivityIndicator, ProgressBar, Text, useTheme } from 'react-native-paper';
import Markdown from 'react-native-marked';
import makeStyles, { markdownStyles } from './styles';

const Conversation = ({ data, loading }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const scrollView = useRef();

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
          <Text variant="titleSmall" style={{ marginTop: 20 }}>
            Loading messages, please wait...
          </Text>
        </View>
      ) : (
        <ScrollView ref={scrollView} onContentSizeChange={() => scrollView.current.scrollToEnd({ animated: true })}>
          {_.map(data, ({ question, answer }) => (
            <View key={question}>
              <View style={styles.question}>
                <Text variant="labelLarge" style={{ color: 'white' }}>
                  {question}
                </Text>
              </View>
              <Markdown
                value={answer}
                styles={markdownStyles(theme)}
                flatListProps={{
                  initialNumToRender: 8,
                  style: styles.answer,
                }}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default Conversation;
