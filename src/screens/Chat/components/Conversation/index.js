// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FAB, Text, useTheme } from 'react-native-paper';
import { FlatList, View } from 'react-native';
import { useSelector } from 'react-redux';
import _ from 'lodash';
// ------------------------------------------------------------ //
// ------------------------ COMPONENTS ------------------------ //
// ------------------------------------------------------------ //
import Message from '../Message';
// ------------------------------------------------------------ //
// ------------------------- UTILITIES ------------------------ //
// ------------------------------------------------------------ //
import { getChatMessages } from 'app/src/redux/selectors';
import { t } from 'app/src/config/i18n';
import makeStyles from './styles';
// ------------------------------------------------------------ //
// ------------------------- COMPONENT ------------------------ //
// ------------------------------------------------------------ //
const _t = (key, options) => t(`chat.${key}`, options);

const Conversation = ({ data, loading, shouldScroll }) => {
  // --------------------------------------------------------- //
  // ------------------------ REDUX -------------------------- //
  const messages = useSelector(getChatMessages);
  // ------------------------ /REDUX ------------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const theme = useTheme();
  const styles = makeStyles(theme);

  const flatListRef = useRef();

  const [fabEnabled, setFabEnabled] = useState(true);
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  useEffect(() => {
    flatListRef.current && flatListRef.current.scrollToEnd({ animated: false });
  }, [messages]);

  // --------------------------------------------------------- //
  // ----------------------- RENDERERS ----------------------- //
  const renderLoading = useMemo(
    () => (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
        <Text variant="titleSmall" style={styles.loadingText}>
          {_t('loading_messages')}
        </Text>
      </View>
    ),
    [styles.loadingContainer, styles.loadingText],
  );

  const renderMessagesList = useMemo(
    () => (
      <FlatList
        data={data}
        ref={flatListRef}
        scrollEventThrottle={500}
        showsVerticalScrollIndicator={false}
        onEndReached={() => setFabEnabled(false)}
        contentContainerStyle={styles.listContent}
        // onContentSizeChange={() => flatListRef.current && flatListRef.current.scrollToEnd({ animated: true })}
        onScroll={({ nativeEvent }) => _.isEqual(nativeEvent.contentOffset.y, 0) && setFabEnabled(true)}
        renderItem={({ item: { question, answer } }) => <Message flatListRef={flatListRef} question={question} answer={answer} />}
      />
    ),
    [data, styles.listContent],
  );

  const renderFab = useMemo(
    () =>
      !loading && (
        <FAB
          size="small"
          variant="secondary"
          style={styles.fab}
          icon={fabEnabled ? 'arrow-down-circle' : 'arrow-up-circle'}
          onPress={() => {
            if (fabEnabled) {
              flatListRef.current.scrollToEnd({ animated: true });
            } else {
              flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
            }
          }}
        />
      ),
    [fabEnabled, loading, styles.fab],
  );

  return (
    <>
      <View style={styles.flex1}>{loading ? renderLoading : renderMessagesList}</View>
      {renderFab}
    </>
  );
};

export default Conversation;
