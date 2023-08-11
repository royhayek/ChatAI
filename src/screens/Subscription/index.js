import React, { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { Alert, NativeModules, ScrollView, TouchableOpacity, View } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import RegularButton from 'app/src/components/Buttons/Regular';
import { BENEFITS, dummyPlans, benefits } from './config';
import { t } from 'app/src/config/i18n';
import makeStyles from './styles';
import { getPurchaseHistoryAsync } from 'expo-in-app-purchases';
import { useDispatch, useSelector } from 'react-redux';
import { requestSubscription, useIAP } from 'react-native-iap';
import { setOwnedSubscription } from 'app/src/redux/slices/appSlice';
import { isAndroid } from 'app/src/helpers';

const _t = (key, options) => t(`subscription.${key}`, options);

const SubscriptionScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const updateOwnedSubscription = useCallback(payload => dispatch(setOwnedSubscription(payload)), [dispatch]);

  const ownedSubscription = useSelector(state => state.app.ownedSubscription);
  const subscriptions = useSelector(state => state.app.subscriptions);

  const theme = useTheme();
  const styles = makeStyles(theme);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscribed, setSubscribed] = useState(false);

  const plans = useMemo(() => {
    const firstSubscription = _.first(subscriptions);
    const offerDetails = firstSubscription?.subscriptionOfferDetails;
    return _.forEach(offerDetails, detail => detail);
  }, []);

  const handleBuySubscription = async () => {
    const { RNIapIos, RNIapIosSk2, RNIapModule, RNIapAmazonModule } = NativeModules;
    const isPlay = isAndroid && !!RNIapModule;
    const firstSubscription = _.first(subscriptions);
    const productId = firstSubscription?.productId;
    const offerToken = selectedPlan?.offerToken;
    if (isPlay && !offerToken) {
      console.warn(`There are no subscription Offers for selected product (Only requiered for Google Play purchases): ${productId}`);
    }
    try {
      await requestSubscription({
        sku: productId,
        ...(offerToken && {
          subscriptionOffers: [{ sku: productId, offerToken }],
        }),
      });
      setSubscribed(true);
    } catch (error) {
      if (error) {
        console.error(`[${error.code}]: ${error.message}`, error);
      } else {
        console.error('handleBuySubscription', error);
      }
    }
  };

  const getHistory = useCallback(async () => {
    const history = await getPurchaseHistoryAsync();
    console.debug('history in subscriptions', history);
  }, []);

  useEffect(() => {
    getHistory();
    !_.isEmpty(subscriptions) && _.isEmpty(selectedPlan) && setSelectedPlan(_.first(_.first(subscriptions)?.subscriptionOfferDetails));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptions]);

  useEffect(() => {
    console.debug('[useEffect] :: ', { ownedSubscription, subscribed });
    ownedSubscription && subscribed && navigation.goBack();
  }, [navigation, ownedSubscription, subscribed]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.flex1} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        <Text variant="headlineMedium" style={styles.title}>
          {_t('unlock_access')}
        </Text>
        <View style={styles.benefitsContainer}>
          {_.map(benefits(theme), ({ id, icon, title, description }) => (
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
          {_.map(subscriptions, subscription => {
            const subscriptionOfferDetails = _.first(subscription.subscriptionOfferDetails);
            const isSelected = _.isEqual(selectedPlan, subscriptionOfferDetails);
            const pricingPhase = _.first(subscriptionOfferDetails.pricingPhases.pricingPhaseList);
            return (
              <TouchableOpacity
                key={subscriptionOfferDetails?.basePlanId}
                onPress={() => setSelectedPlan(subscriptionOfferDetails)}
                style={styles.planContainer(isSelected)}>
                <Text variant="bodyMedium" style={styles.planTitle}>
                  {_t(pricingPhase.billingPeriod)}
                </Text>
                <Text variant="bodyLarge" style={styles.planPrice}>
                  {pricingPhase.formattedPrice} {/* /{plan?.unit} */}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <RegularButton title={t('common.continue')} onPress={handleBuySubscription} />
        <Text variant="bodySmall" style={styles.cancelText}>
          {_t('cancel_anytime')}
        </Text>
      </ScrollView>
    </View>
  );
};

export default SubscriptionScreen;
