import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import enUS from './lang/en';
import zhCN from './lang/zh-CN';
import zhTW from './lang/zh-TW';
import tr from './lang/tr';
// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en: enUS,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  tr: tr,
};
// Set the locale once at the beginning of your app.
// i18n.locale = Localization.locale;
i18n.fallbacks = true;