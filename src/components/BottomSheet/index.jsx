// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React from 'react';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Portal, useTheme } from 'react-native-paper';
// ------------------------------------------------------------ //
// ------------------------- UTILITIES ------------------------ //
// ------------------------------------------------------------ //
import makeStyles from './styles';
// ------------------------------------------------------------ //
// ------------------------- COMPONENT ------------------------ //
// ------------------------------------------------------------ //
const CustomBottomSheet = ({ sheetRef, snapPoints, handleSheetClose, children }) => {
  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const theme = useTheme();
  const styles = makeStyles(theme);
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- RENDERERS ----------------------- //
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
        backdropComponent={props => <BottomSheetBackdrop {...props} opacity={0.5} disappearsOnIndex={-1} appearsOnIndex={0} pressBehavior="close" />}>
        {children}
      </BottomSheet>
    </Portal>
  );
};

export default CustomBottomSheet;
