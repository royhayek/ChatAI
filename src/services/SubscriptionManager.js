import { useCallback, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import _ from 'lodash';
import {
  clearTransactionIOS,
  endConnection,
  finishTransaction,
  flushFailedPurchasesCachedAsPendingAndroid,
  getAvailablePurchases,
  getPurchaseHistory,
  getSubscriptions,
  initConnection,
  promotedProductListener,
  purchaseErrorListener,
  purchaseUpdatedListener,
  setup,
} from 'react-native-iap';
import { useDispatch } from 'react-redux';
import { isAndroid } from '../helpers';
import { setOwnedSubscription, setPaidSubscriptions } from '../redux/slices/appSlice';

const SubscriptionManager = () => {
  const dispatch = useDispatch();
  const updateSubscriptions = useCallback(payload => dispatch(setPaidSubscriptions(payload)), [dispatch]);
  const updateOwnedSubscription = useCallback(payload => dispatch(setOwnedSubscription(payload)), [dispatch]);

  const fetchAvailablePurchases = async () => {
    try {
      const history = await getPurchaseHistory();
      const purchases = await getAvailablePurchases();
      const lastPurchase = _.last(purchases);
      updateOwnedSubscription(lastPurchase?.productId);
      console.debug('[PURCHASE HISTORY] :: ', { history });
      console.debug('[AVAILABLE PURCHASES] :: ', { purchases });
    } catch (error) {
      console.debug('[fetchAvailablePurchases] - ERROR :: ', error);
    }
  };

  useEffect(() => {
    setup({ storekitMode: 'STOREKIT2_MODE' });
    // Initialize the InAppPurchase module
    initConnection()
      .then(async () => {
        if (isAndroid) {
          await flushFailedPurchasesCachedAsPendingAndroid();
        } else {
          __DEV__ && (await clearTransactionIOS());
        }

        fetchAvailablePurchases();

        // Load available products (subscription plans) from the app stores
        const productIds = Platform.select({
          android: ['chatai_pro', 'chatai_pro_monthly', 'chatai_pro_yearly'],
          ios: ['ios_subscription_weekly', 'ios_subscription_monthly', 'ios_subscription_yearly'],
        });
        return getSubscriptions({ skus: productIds });
      })
      .then(subscriptions => {
        // Here you can store the available subscription plans in your state or Redux store
        console.log('Available Subscription Plans:', subscriptions);

        updateSubscriptions(subscriptions);
      })
      .catch(error => {
        console.log('Error setting up subscriptions:', error);
      });

    const purchaseUpdate = purchaseUpdatedListener(async purchase => {
      const receipt = purchase.transactionReceipt ? purchase.transactionReceipt : purchase.originalJson;

      if (receipt) {
        try {
          const acknowledgeResult = await finishTransaction({ purchase });

          console.info('acknowledgeResult', acknowledgeResult);
        } catch (error) {
          console.debug('finishTransaction', error);
        }

        const parsedReceipt = JSON.parse(receipt);
        console.debug('[RECEIPT AFTER PURCHASE] :: ', parsedReceipt);
        updateOwnedSubscription(parsedReceipt.productId);
      }
    });

    const purchaseError = purchaseErrorListener(error => {
      Alert.alert('purchase error', JSON.stringify(error));
    });

    const promotedProduct = promotedProductListener(productId => Alert.alert('Product promoted', productId));

    return () => {
      purchaseUpdate?.remove();
      purchaseError?.remove();
      promotedProduct?.remove();

      endConnection();
    };
  }, []);

  return null;
};

export default SubscriptionManager;
