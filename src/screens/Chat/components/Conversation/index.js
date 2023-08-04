import React, { useRef, useState } from 'react';
import _ from 'lodash';
import { FlatList, ScrollView, View } from 'react-native';
import { ActivityIndicator, FAB, Text, useTheme } from 'react-native-paper';
import Markdown from 'react-native-marked';
import makeStyles, { markdownStyles } from './styles';
import { isCloseToBottom } from 'app/src/helpers';

const Conversation = ({ data, loading }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const flatListRef = useRef();

  const [fabEnabled, setFabEnabled] = useState(true);
  
  return (
    <>
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator />
            <Text variant="titleSmall" style={{ marginTop: 20 }}>
              Loading messages, please wait...
            </Text>
          </View>
        ) : (
          <FlatList
            data={data}
            ref={flatListRef}
            scrollEventThrottle={500}
            onEndReached={() => setFabEnabled(false)}
            onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
            onScroll={({ nativeEvent }) => _.isEqual(nativeEvent.contentOffset.y, 0) && setFabEnabled(true)}
            renderItem={({ item: { question, answer } }) => (
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
            )}
          />
        )}
      </View>
      {!loading && (
        <FAB
          style={styles.fab(theme)}
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
      )}
    </>
  );
};

export default Conversation;
