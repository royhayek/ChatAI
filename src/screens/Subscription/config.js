import { t } from 'app/src/config/i18n';
import { appName } from 'app/src/helpers';
import NoAdsIcon from 'app/src/lib/icons/NoAdsIcon';
import StarsIcon from 'app/src/lib/icons/StarsIcon';
import UnlimitedIcon from 'app/src/lib/icons/UnlimitedIcon';

const _t = (key, options) => t(`subscription.${key}`, options);

export const BENEFITS = [
  {
    id: 1,
    icon: <StarsIcon color="white" />,
    title: _t('powered_by_chatgpt'),
    description: _t('accurate_and_detailed'),
  },
  {
    id: 2,
    icon: <UnlimitedIcon color="white" />,
    title: _t('no_limits'),
    description: _t('unlimited_chats'),
  },
  {
    id: 3,
    icon: <NoAdsIcon color="white" />,
    title: _t('no_ads'),
    description: _t('enjoy_without_ads', { name: appName }),
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
