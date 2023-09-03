// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useCallback, useEffect, useMemo } from 'react';
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
const Message = ({ flatListRef, question, answer }) => {
  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const isRTL = hasArabicCharacters(answer) && I18nManager.isRTL;

  const theme = useTheme();
  const styles = makeStyles(theme, isRTL);
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  // useEffect(() => {
  //   console.debug('answer', answer)
  //   flatListRef.current && flatListRef.current.scrollToEnd({ animated: true });
  // }, [flatListRef, answer]);

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
        styles={markdownStyles(theme, isRTL)}
        flatListProps={{
          initialNumToRender: 8,
          style: styles.answer,
        }}
      />
    ),
    [answer, theme, isRTL, styles.answer],
  );

  return (
    <View key={question}>
      {renderQuestion}
      {renderAnswer}
    </View>
  );
};

export default Message;
