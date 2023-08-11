/* eslint-disable react/react-in-jsx-scope */
import UnlimitedIcon from 'app/src/lib/icons/UnlimitedIcon';
import NoAdsIcon from 'app/src/lib/icons/NoAdsIcon';
import StarsIcon from 'app/src/lib/icons/StarsIcon';
import { appName } from 'app/src/helpers';
import { t } from 'app/src/config/i18n';

const _t = (key, options) => t(`subscription.${key}`, options);

export const benefits = theme => [
  {
    id: 1,
    icon: <StarsIcon color={theme.dark ? theme.colors.white : theme.colors.black} />,
    title: _t('powered_by_chatgpt'),
    description: _t('accurate_and_detailed'),
  },
  {
    id: 2,
    icon: <UnlimitedIcon color={theme.dark ? theme.colors.white : theme.colors.black} />,
    title: _t('no_limits'),
    description: _t('unlimited_chats'),
  },
  {
    id: 3,
    icon: <NoAdsIcon color={theme.dark ? theme.colors.white : theme.colors.black} />,
    title: _t('no_ads'),
    description: _t('enjoy_without_ads', { name: appName }),
  },
];

export const dummyPlans = [
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
