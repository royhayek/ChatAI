// ------------------------------------------------------------ //
// ------------------------- PACKAGES ------------------------- //
// ------------------------------------------------------------ //
import React, { useEffect, useMemo, useState } from 'react';
import { NativeModules, ScrollView, TouchableOpacity, View } from 'react-native';
import { requestSubscription } from 'react-native-iap';
import { useTheme, Text, Badge } from 'react-native-paper';
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
import { getOwnedSubscription, getSubscriptions } from 'app/src/redux/selectors';
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
  const ownedSubscription = useSelector(getOwnedSubscription);
  const subscriptions = useSelector(getSubscriptions);
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
      console.warn(`There are no subscription Offers for selected product (Only required for Google Play purchases): ${productId}`);
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

  // ---------------------- /CALLBACKS ----------------------- //
  // --------------------------------------------------------- //

  // --------------------------------------------------------- //
  // ------------------------ EFFECTS ------------------------ //
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    !_.isEmpty(subscriptions) &&
      _.isEmpty(selectedPlan) &&
      setSelectedPlan({ ..._.first(_.first(subscriptions)?.subscriptionOfferDetails), productId: _.first(subscriptions).productId });
  }, [subscriptions, selectedPlan]);
  /* eslint-enable react-hooks/exhaustive-deps */

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
          const isSelected = _.isEqual(selectedPlan?.basePlanId, subscriptionOfferDetails?.basePlanId);
          const isOwned = ownedSubscription && _.isEqual(ownedSubscription, subscription?.productId);
          const pricingPhase = _.first(subscriptionOfferDetails.pricingPhases.pricingPhaseList);
          return (
            <TouchableOpacity
              disabled={isOwned}
              key={subscriptionOfferDetails?.basePlanId}
              onPress={() => setSelectedPlan({ ...subscriptionOfferDetails, productId: subscription.productId })}
              style={styles.planContainer(isSelected, isOwned)}>
              <Text variant="bodyMedium" style={styles.planTitle}>
                {_t(pricingPhase.billingPeriod)}
              </Text>
              <Text variant="bodyLarge" style={styles.planPrice}>
                {pricingPhase.formattedPrice} {/* /{plan?.unit} */}
              </Text>
              {isOwned && (
                <Badge style={styles.ownBadge}>
                  <Text variant="labelSmall" style={styles.badgeText}>
                    {_t('you_own_this_plan')}
                  </Text>
                </Badge>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    ),
    [ownedSubscription, selectedPlan, styles, subscriptions],
  );

  const renderEmptySubscriptions = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <LottieView autoPlay loop={false} style={styles.lottie} source={require('../../../assets/no-subscriptions.json')} />
        <Text style={styles.noSubscriptionsText}>{_t('no_subscriptions_found')}</Text>
        <Text variant="bodySmall" style={styles.referText}>
          {_t('refer_to_documentation')}
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
        <RegularButton
          title={t('common.continue')}
          onPress={handleBuySubscription}
          disabled={_.isEmpty(subscriptions) || _.isEqual(ownedSubscription, selectedPlan?.productId)}
        />
        <Text variant="bodySmall" style={styles.cancelText}>
          {_t('cancel_anytime')}
        </Text>
      </ScrollView>
    </View>
  );
};

export default SubscriptionScreen;
