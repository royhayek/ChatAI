import { View, Text, ScrollView, useWindowDimensions } from 'react-native';
import React from 'react';
import _ from 'lodash';
import { useTheme } from 'react-native-paper';
import makeStyles from './styles';
import RenderHtml from 'react-native-render-html';
import { PRIVACY_POLICY, TERMS_AND_CONDITIONS } from 'app/src/config/constants';

const InfoScreen = ({ route }) => {
  const { width } = useWindowDimensions();
  const type = route.params.type;
  const theme = useTheme();
  const styles = makeStyles(theme);

  const uri = _.isEqual(type, 'privacy_policy') ? PRIVACY_POLICY : TERMS_AND_CONDITIONS;

  return (
    <ScrollView style={styles.container}>
      <RenderHtml
        source={{ uri }}
        contentWidth={width}
        tagsStyles={{
          body: {
            color: theme.dark ? theme.colors.white : theme.colors.black,
            lineHeight: 19,
          },
        }}
      />
    </ScrollView>
  );
};

export default InfoScreen;
