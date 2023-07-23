import React, { useCallback, useState } from 'react';
import _ from 'lodash';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import RegularButton from 'app/src/components/Buttons/Regular';
import Icon from '../../components/Icon';
import { BENEFITS, PLANS } from './config';
import { t } from 'app/src/config/i18n';
import makeStyles from './styles';

const _t = (key, options) => t(`subscription.${key}`, options);

const SubscriptionScreen = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0]);

  const handleContinuePress = useCallback(() => {}, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.flex1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}>
        <Text variant="headlineMedium" style={styles.title}>
          {_t('unlock_access')}
        </Text>
        <View style={styles.benefitsContainer}>
          {_.map(BENEFITS, ({ id, icon, title, description }) => (
            <View key={id} style={styles.benefitContainer}>
              <Icon name={icon} size={32} iconStyle={styles.benefitIcon} />
              <View style={styles.benefitTexts}>
                <Text variant="bodyLarge" style={styles.benefitTitle}>
                  {title}
                </Text>
                <Text variant="bodyMedium" style={styles.benefitDesc}>
                  {description}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.plansContainer}>
          {_.map(PLANS, plan => {
            const isSelected = _.isEqual(selectedPlan, plan);
            return (
              <TouchableOpacity
                key={plan?.id}
                onPress={() => setSelectedPlan(plan)}
                style={styles.planContainer(isSelected)}>
                <Text variant="bodyMedium" style={styles.planTitle}>
                  {plan?.title}
                </Text>
                <Text variant="bodyLarge" style={styles.planPrice}>
                  US${parseInt(plan?.price).toFixed(2)}/{plan?.unit}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <RegularButton title={t('common.continue')} onPress={handleContinuePress} />
        <Text variant="bodySmall" style={styles.cancelText}>
          {_t('cancel_anytime')}
        </Text>
      </ScrollView>
    </View>
  );
};

export default SubscriptionScreen;
