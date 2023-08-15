// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useMemo } from 'react';
import { useTheme } from 'react-native-paper';
import Markdown from 'react-native-marked';
import { View, Text, I18nManager } from 'react-native';
// ------------------------------------------------------------ //
// ------------------------- UTILITIES ------------------------ //
// ------------------------------------------------------------ //
import makeStyles, { markdownStyles } from './styles';
import { hasArabicCharacters } from 'app/src/helpers';
// ------------------------------------------------------------ //
// ------------------------ COMPONENT ------------------------- //
// ------------------------------------------------------------ //
const Message = ({ question, answer }) => {
  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const isRTL = hasArabicCharacters(answer) && I18nManager.isRTL;

  const theme = useTheme();
  const styles = makeStyles(theme, isRTL);
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

  const renderAnswer = useMemo(() => {
    console.debug('I18nManager.isRTL', I18nManager.isRTL);
    console.debug('isRTL', isRTL);
    return (
      <Markdown
        value={answer}
        styles={markdownStyles(theme, isRTL)}
        flatListProps={{
          initialNumToRender: 8,
          style: styles.answer,
        }}
      />
    );
  }, [isRTL, answer, theme, styles.answer]);

  return (
    <View key={question}>
      {renderQuestion}
      {renderAnswer}
    </View>
  );
};

export default Message;
