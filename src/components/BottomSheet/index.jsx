import React from 'react';
import { Portal, useTheme } from 'react-native-paper';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import makeStyles from './styles';
import { SafeAreaView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const CustomBottomSheet = ({ sheetRef, snapPoints, handleSheetClose, children }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const insets = useSafeAreaInsets();

  return (
    <Portal>
      <BottomSheet
        index={-1}
        ref={sheetRef}
        enablePanDownToClose
        snapPoints={snapPoints}
        onClose={handleSheetClose}
        handleIndicatorStyle={{ display: 'none' }}
        backgroundStyle={styles.bottomSheetBackground}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            opacity={0.5}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            pressBehavior="close"
          />
        )}>
        {children}
      </BottomSheet>
    </Portal>
  );
};

export default CustomBottomSheet;
