import { createI18n } from 'vue-i18n'

import en from '../locales/en.json'
import zhCN from '../locales/zh-CN.json'
import es from '../locales/es.json'

// Get language from localStorage or default to 'en'
const getStoredLanguage = () => {
  const stored = localStorage.getItem('userLanguage')
  return stored || 'en'
}

// Create Vue i18n instance
const i18n = createI18n({
  legacy: false,
  locale: getStoredLanguage(),
  fallbackLocale: 'en',
  messages: {
    en: en,
    'zh-CN': zhCN,
    es: es
  }
})

export default i18n
