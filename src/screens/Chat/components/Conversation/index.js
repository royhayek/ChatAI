import _ from 'lodash';
import { ActivityIndicator, FAB, Text, useTheme } from 'react-native-paper';
import React, { useMemo, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import Message from '../Message';
import { t } from 'app/src/config/i18n';
import makeStyles from './styles';

const _t = (key, options) => t(`chat.${key}`, options);

const Conversation = ({ data, loading }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const flatListRef = useRef();

  const [fabEnabled, setFabEnabled] = useState(true);

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
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        onScroll={({ nativeEvent }) => _.isEqual(nativeEvent.contentOffset.y, 0) && setFabEnabled(true)}
        renderItem={({ item: { question, answer } }) => <Message question={question} answer={answer} />}
      />
    ),
    [data, styles.listContent],
  );

  const renderFab = useMemo(
    () =>
      !loading && (
        <FAB
          style={styles.fab}
          icon={fabEnabled ? 'arrow-down-circle' : 'arrow-up-circle'}
          size="small"
          variant="secondary"
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
