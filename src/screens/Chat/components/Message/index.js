// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useMemo } from 'react';
import { useTheme } from 'react-native-paper';
import Markdown from 'react-native-marked';
import { View, Text } from 'react-native';
// ------------------------------------------------------------ //
// ------------------------- UTILITIES ------------------------ //
// ------------------------------------------------------------ //
import makeStyles, { markdownStyles } from './styles';
// ------------------------------------------------------------ //
// ------------------------ COMPONENT ------------------------- //
// ------------------------------------------------------------ //
const Message = ({ question, answer }) => {
  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const theme = useTheme();
  const styles = makeStyles(theme);
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- RENDERERS ----------------------- //
  const renderQuestionText = useMemo(
    () => (
      <Text variant="labelLarge" style={styles.questionText}>
        {question}
      </Text>
    ),
    [question, styles.questionText],
  );

  const renderQuestion = useMemo(() => <View style={styles.question}>{renderQuestionText}</View>, [renderQuestionText, styles.question]);

  const renderAnswer = useMemo(
    () => (
      <Markdown
        value={answer}
        styles={markdownStyles(theme)}
        flatListProps={{
          initialNumToRender: 8,
          style: styles.answer,
        }}
      />
    ),
    [theme, answer, styles.answer],
  );

  return (
    <View key={question}>
      {renderQuestion}
      {renderAnswer}
    </View>
  );
};

export default Message;
