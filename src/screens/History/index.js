// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import { ActivityIndicator, IconButton, Text, useTheme } from 'react-native-paper';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Image, RefreshControl, View } from 'react-native';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { ms } from 'react-native-size-matters';
// ------------------------------------------------------------ //
// ------------------------ COMPONENTS ------------------------ //
// ------------------------------------------------------------ //
import CustomBottomSheet from 'app/src/components/BottomSheet';
import RegularButton from 'app/src/components/Buttons/Regular';
import HistoryCard from './components/HistoryCard';
// ------------------------------------------------------------ //
// ------------------------- UTILITIES ------------------------ //
// ------------------------------------------------------------ //
import { deleteAllConversations, getConversations } from 'app/src/data/localdb';
import { t } from 'app/src/config/i18n';
import makeStyles from './styles';
// ------------------------------------------------------------ //
// ------------------------ COMPONENT ------------------------- //
// ------------------------------------------------------------ //
const _t = (key, options) => t(`history.${key}`, options);

const HistoryScreen = ({ navigation }) => {
  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const theme = useTheme();
  const styles = makeStyles(theme);

  const bottomSheetRef = useRef();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [conversations, setConversations] = useState([]);

  const snapPoints = useMemo(() => ['25%'], []);
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- CALLBACKS ----------------------- //
  const refreshConversations = useCallback(isRefreshing => {
    !isRefreshing && setLoading(true);
    getConversations().then(convos => {
      setConversations(convos);
      setRefreshing(false);
      !isRefreshing && setLoading(false);
    });
  }, []);

  const handleSheetClose = useCallback(() => bottomSheetRef.current.close(), []);

  const handleDeletePress = useCallback(() => bottomSheetRef.current.expand(), []);

  const handleDeleteAllHistory = useCallback(async () => {
    await deleteAllConversations().then(() => console.debug('History Deleted Successfully'));
    refreshConversations(false);
    handleSheetClose();
  }, [handleSheetClose, refreshConversations]);

  const renderDeleteIcon = useCallback(
    () => conversations.length > 0 && <Octicons name="trash" size={ms(22)} color={theme.dark ? theme.colors.white : theme.colors.black} />,
    [conversations.length, theme.colors.black, theme.colors.white, theme.dark],
  );

  const renderHeaderRight = useCallback(
    () => <IconButton size={ms(22)} onPress={handleDeletePress} icon={renderDeleteIcon} />,
    [handleDeletePress, renderDeleteIcon],
  );
  // ---------------------- /CALLBACKS ----------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ------------------------ EFFECTS ------------------------ //
  useEffect(() => {
    navigation.setOptions({ headerRight: renderHeaderRight });
  }, [navigation, renderHeaderRight]);

  useEffect(() => {
    refreshConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // ----------------------- /EFFECTS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- RENDERERS ----------------------- //
  const renderRefreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={refreshing}
        tintColor={theme.dark ? theme.colors.white : theme.colors.black}
        onRefresh={() => refreshConversations(true)}
      />
    ),
    [refreshConversations, refreshing, theme.colors.black, theme.colors.white, theme.dark],
  );

  const renderList = useMemo(
    () => (
      <FlatList
        data={conversations}
        key={item => item.id}
        refreshing={refreshing}
        refreshControl={renderRefreshControl}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => <HistoryCard item={item} index={index} refresh={refreshConversations} />}
      />
    ),
    [refreshConversations, conversations, refreshing, renderRefreshControl, styles.listContent],
  );

  const renderLoadingOrEmpty = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <>
            <Image source={require('../../../assets/empty-history.png')} style={styles.emptyImage} />
            <Text variant="bodyMedium" style={styles.emptyText}>
              {_t('no_history_found')}
            </Text>
          </>
        )}
      </View>
    ),
    [loading, styles.emptyContainer, styles.emptyImage, styles.emptyText],
  );

  const renderConfBottomSheet = useMemo(
    () => (
      <CustomBottomSheet sheetRef={bottomSheetRef} snapPoints={snapPoints} onClose={handleSheetClose}>
        <Text variant="bodyLarge" style={styles.modalTitle}>
          {_t('delete_your_history')}
        </Text>
        <View style={styles.modalButtons}>
          <RegularButton
            title={_t('delete')}
            onPress={handleDeleteAllHistory}
            startIcon={<Octicons name="trash" size={ms(18)} color={theme.colors.white} />}
          />
          <RegularButton
            title={_t('cancel')}
            startIcon={<Ionicons name="close" size={ms(18)} color={theme.colors.white} />}
            onPress={handleSheetClose}
          />
        </View>
      </CustomBottomSheet>
    ),
    [handleDeleteAllHistory, handleSheetClose, snapPoints, styles.modalButtons, styles.modalTitle, theme.colors.white],
  );

  return (
    <View style={styles.container}>
      {conversations.length > 0 ? renderList : renderLoadingOrEmpty}
      {renderConfBottomSheet}
    </View>
  );
};

export default HistoryScreen;
