// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NativeModules, ScrollView, TouchableOpacity, View } from 'react-native';
import { getPurchaseHistoryAsync } from 'expo-in-app-purchases';
import { requestSubscription } from 'react-native-iap';
import { useTheme, Text } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { useSelector } from 'react-redux';
import _ from 'lodash';
// ------------------------------------------------------------ //
// ------------------------ COMPONENTS ------------------------ //
// ------------------------------------------------------------ //
import RegularButton from 'app/src/components/Buttons/Regular';
// ------------------------------------------------------------ //
// ------------------------- UTILITIES ------------------------ //
// ------------------------------------------------------------ //
import { isAndroid } from 'app/src/helpers';
import { t } from 'app/src/config/i18n';
import { benefits } from './config';
import makeStyles from './styles';
// ------------------------------------------------------------ //
// ------------------------- COMPONENT ------------------------ //
// ------------------------------------------------------------ //
const _t = (key, options) => t(`subscription.${key}`, options);

const SubscriptionScreen = ({ navigation }) => {
  // --------------------------------------------------------- //
  // ----------------------- REDUX --------------------------- //
  const subscriptions = useSelector(state => state.app.subscriptions);
  const ownedSubscription = useSelector(state => state.app.ownedSubscription);
  // ----------------------- /REDUX -------------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- STATICS ------------------------- //
  const theme = useTheme();
  const styles = makeStyles(theme);

  const [subscribed, setSubscribed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  // ----------------------- /STATICS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- CALLBACKS ----------------------- //
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
  // ---------------------- /CALLBACKS ----------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ------------------------ EFFECTS ------------------------ //
  useEffect(() => {
    getHistory();
    !_.isEmpty(subscriptions) && _.isEmpty(selectedPlan) && setSelectedPlan(_.first(_.first(subscriptions)?.subscriptionOfferDetails));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptions, selectedPlan]);

  useEffect(() => {
    ownedSubscription && subscribed && navigation.goBack();
  }, [navigation, ownedSubscription, subscribed]);
  // ----------------------- /EFFECTS ------------------------ //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ----------------------- RENDERERS ----------------------- //
  const renderBenefits = useMemo(
    () => (
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
    ),
    [styles.benefitContainer, styles.benefitDesc, styles.benefitTexts, styles.benefitTitle, styles.benefitsContainer, theme],
  );

  const renderSubscriptionsList = useMemo(
    () => (
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
    ),
    [selectedPlan, styles, subscriptions],
  );

  const renderEmptySubscriptions = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <LottieView autoPlay loop={false} style={styles.lottie} source={require('../../../assets/no-subscriptions.json')} />
        <Text style={styles.noSubscriptionsText}>No Subscriptions Found</Text>
        <Text variant="bodySmall" style={styles.referText}>
          Please refer to the documentation to know how to add subscriptions
        </Text>
      </View>
    ),
    [styles.emptyContainer, styles.lottie, styles.noSubscriptionsText, styles.referText],
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        <Text variant="headlineMedium" style={styles.title}>
          {_t('unlock_access')}
        </Text>
        {renderBenefits}
        {!_.isEmpty(subscriptions) ? renderSubscriptionsList : renderEmptySubscriptions}
        <RegularButton title={t('common.continue')} onPress={handleBuySubscription} disabled={_.isEmpty(subscriptions)} />
        <Text variant="bodySmall" style={styles.cancelText}>
          {_t('cancel_anytime')}
        </Text>
      </ScrollView>
    </View>
  );
};

export default SubscriptionScreen;
