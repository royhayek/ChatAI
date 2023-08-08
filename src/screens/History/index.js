import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';
import CustomBottomSheet from 'app/src/components/BottomSheet';
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import {
  deleteAllConversations,
  deleteConversation,
  getConversations,
} from 'app/src/data/localdb';
import makeStyles from './styles';
import RegularButton from 'app/src/components/Buttons/Regular';
import { t } from 'app/src/config/i18n';

const _t = (key, options) => t(`history.${key}`, options);

const HistoryScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [conversations, setConversations] = useState([]);

  const bottomSheetRef = useRef();
  const snapPoints = ['25%'];

  const refreshConversations = useCallback(refreshing => {
    !refreshing && setLoading(true);
    getConversations().then(conversations => {
      setConversations(conversations);
      setRefreshing(false);
      !refreshing && setLoading(false);
    });
  }, []);

  const handleSheetClose = useCallback(
    () => bottomSheetRef.current.close(),
    [],
  );

  const handleTextPress = useCallback(conversation => {
    navigation.navigate('Chat', { conversation });
  }, []);

  const handleDeleteHistory = useCallback(async id => {
    await deleteConversation(id).then(() =>
      console.debug('History Deleted Successfully'),
    );
    refreshConversations(false);
  }, []);

  const handleDeletePress = useCallback(
    () => bottomSheetRef.current.expand(),
    [],
  );

  const handleDeleteAllHistory = useCallback(async () => {
    await deleteAllConversations().then(() =>
      console.debug('History Deleted Successfully'),
    );
    refreshConversations(false);
    handleSheetClose();
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          size={22}
          onPress={handleDeletePress}
          icon={() =>
            conversations.length > 0 && (
              <Octicons
                name="trash"
                size={22}
                color={theme.dark ? 'white' : 'black'}
              />
            )
          }
        />
      ),
    });
  }, [conversations.length, handleDeletePress, navigation, theme.dark]);

  useEffect(() => {
    refreshConversations();
  }, []);

  return (
    <View style={styles.container}>
      {conversations.length > 0 ? (
        <FlatList
          data={conversations}
          key={item => item.id}
          refreshing={refreshing}
          refreshControl={
            <RefreshControl
              // colors={theme.dark ? [theme.colors.white, theme.colors.black] : [theme.colors.black]}
              tintColor={theme.dark ? theme.colors.white : theme.colors.black}
              refreshing={refreshing}
              onRefresh={() => refreshConversations(true)}
            />
          }
          // onRefresh={refreshConversations}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <>
              <TouchableOpacity
                key={index}
                onPress={() => handleTextPress(item)}
                style={{
                  flexDirection: 'row',
                  marginBottom: 15,
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 10,
                  alignItems: 'center',
                  borderColor: theme.colors.secondary,
                  backgroundColor: theme.dark
                    ? theme.colors.backdrop
                    : theme.colors.background,
                }}>
                <Ionicons
                  name="md-chatbox-outline"
                  size={20}
                  color={theme.dark ? 'white' : 'black'}
                />
                <View style={styles.content}>
                  <Text variant="labelLarge">{item?.title}</Text>
                  <Text variant="bodySmall" style={styles.date}>
                    {item?.createdAt}
                  </Text>
                </View>
                <IconButton
                  size={17}
                  mode="outlined"
                  onPress={() => handleDeleteHistory(item?.id)}
                  containerColor={theme.colors.background}
                  icon={props => (
                    <Ionicons
                      name="ios-close"
                      size={20}
                      color={theme.dark ? 'white' : 'black'}
                    />
                  )}
                />
              </TouchableOpacity>
            </>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <>
              <Image
                source={require('../../../assets/empty-history.png')}
                style={{ width: 100, height: 100, marginBottom: 20 }}
              />
              <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>
                {_t('no_history_found')}
              </Text>
            </>
          )}
        </View>
      )}

      <CustomBottomSheet
        sheetRef={bottomSheetRef}
        snapPoints={snapPoints}
        onClose={handleSheetClose}>
        <Text variant="bodyLarge" style={styles.modalTitle}>
          {_t('delete_your_history')}
        </Text>
        <View style={styles.modalButtons}>
          <RegularButton
            title={_t('delete')}
            leftIcon={
              <Octicons name="trash" size={18} color={theme.colors.white} />
            }
            onPress={handleDeleteAllHistory}
          />
          <RegularButton
            title={_t('cancel')}
            leftIcon={
              <Ionicons name="close" size={18} color={theme.colors.white} />
            }
            onPress={handleSheetClose}
          />
        </View>
      </CustomBottomSheet>
    </View>
  );
};

export default HistoryScreen;
