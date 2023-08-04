import React, { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import InAppPurchase from 'react-native-iap';
import { useDispatch } from 'react-redux';
import { setSubProducts } from '../redux/slices/appSlice';

const SubscriptionManager = () => {
  const dispatch = useDispatch();
  const updateSubProducts = useCallback(payload => dispatch(setSubProducts(payload)), [dispatch]);

  useEffect(() => {
    // Initialize the InAppPurchase module
    InAppPurchase.prepare()
      .then(() => {
        // Load available products (subscription plans) from the app stores
        const productIds = Platform.select({
          android: ['chatai_pro', 'chatai-pro', 'chata-pro-monthly', 'chatai-pro-yearly'],
          ios: ['ios_subscription_weekly', 'ios_subscription_monthly', 'ios_subscription_yearly'],
        });
        return InAppPurchase.getProducts(productIds);
      })
      .then(products => {
        // Here you can store the available subscription plans in your state or Redux store
        console.log('Available Subscription Plans:', products);
        updateSubProducts(products);
      })
      .catch(error => {
        console.log('Error setting up subscriptions:', error.message);
      });
  }, []);

  const handleSubscriptionPurchase = async productId => {
    try {
      const purchase = await InAppPurchase.purchase(productId);
      // Handle the purchase response
      console.log('Purchase Response:', purchase);
      // You can implement additional logic here, like updating the user's subscription status in your backend
    } catch (error) {
      console.log('Error making the purchase:', error.message);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  return null;
};

export default SubscriptionManager;
