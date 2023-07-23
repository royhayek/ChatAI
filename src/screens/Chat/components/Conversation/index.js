import React, { useRef } from 'react';
import _ from 'lodash';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Markdown from 'react-native-marked';
import makeStyles from './styles';

const Conversation = ({ data }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const scrollView = useRef();

  const markdownStyles = {
    text: {
      ...theme.fonts.labelLarge,
      color: 'white',
      lineHeight: 23,
    },
    blockquote: {
      ...theme.fonts.labelLarge,
      color: 'white',
    },
    em: {
      ...theme.fonts.bodySmall,
      color: 'white',
      fontWeight: '500',
      fontSize: 12.8,
      lineHeight: 19,
    },
    codespan: {
      ...theme.fonts.labelLarge,
      color: 'white',
      fontWeight: 'bold',
      backgroundColor: theme.colors.secondaryContainer,
    },
    link: {
      ...theme.fonts.labelLarge,
    },
    code: {
      ...theme.fonts.labelLarge,
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
      marginVertical: 5,
      borderRadius: 8,
    },
    table: {
      borderWidth: 1,
      borderRadius: 2,
      borderColor: 'white',
    },
    li: {
      ...theme.fonts.labelLarge,
      color: 'white',
      fontWeight: 'bold',
    }
  };

  return (
    <View style={{ flex: 1 }}>
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
              styles={markdownStyles}
              flatListProps={{
                initialNumToRender: 8,
                style: styles.answer,
              }}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Conversation;
