import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import RegularButton from 'app/src/components/Buttons/Regular';
import { BENEFITS, PLANS } from './config';
import { t } from 'app/src/config/i18n';
import makeStyles from './styles';
import LeftChevron from 'app/src/lib/icons/LeftChevron';
import { getProductsAsync } from 'expo-in-app-purchases';

const _t = (key, options) => t(`subscription.${key}`, options);

const SubscriptionScreen = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [results, setResults] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0]);

  const handleContinuePress = useCallback(() => {}, []);

  const fetchSubscriptions = useCallback(async () => {
    const items = Platform.select({
      ios: [
        'dev.expo.products.premium',
        'dev.expo.payments.updates',
        'dev.expo.payments.adfree',
        'dev.expo.payments.gold',
      ],
      android: ['chatai_pro', 'chatai_pro_monthly', 'chatai-pro-monthly'],
    });

    const { responseCode, results } = await getProductsAsync(items);
    console.debug('responseCode', responseCode);
    console.debug('results', results);
    setResults(results);
    // Alert.alert(results);
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.flex1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}>
        <Text variant="headlineMedium" style={styles.title}>
          {_t('unlock_access')}
        </Text>
        <Text>Results</Text>
        {_.map(results, result => (
          <Text>{result.productId}</Text>
        ))}
        <View style={styles.benefitsContainer}>
          {_.map(BENEFITS, ({ id, icon, title, description }) => (
            <View key={id} style={styles.benefitContainer}>
              {icon}
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
