import { appName } from "app/src/helpers";

export const BENEFITS = [
  {
    id: 1,
    icon: 'stars',
    title: 'Powered by ChatGPT 4',
    description: 'More accurate & detailed replies',
  },
  {
    id: 2,
    icon: 'unlimited',
    title: 'No Limits',
    description: 'Have unlimited chats',
  },
  {
    id: 3,
    icon: 'noAds',
    title: 'No Ads',
    description: `Enjoy ${appName} without any ads`,
  },
];

export const PLANS = [
  {
    id: 1,
    title: 'Weekly',
    price: 8.0,
    unit: 'Week',
  },
  {
    id: 2,
    title: 'Monthly',
    price: 25.0,
    unit: 'Month',
  },
  {
    id: 3,
    title: 'Yearly',
    price: 79.0,
    unit: 'Year',
  },
];
