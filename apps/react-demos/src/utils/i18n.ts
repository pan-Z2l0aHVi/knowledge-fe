import rteEN from '@youknown/react-rte/src/locales/en.json'
import rteZH from '@youknown/react-rte/src/locales/zh.json'
import uiEN from '@youknown/react-ui/src/locales/en.json'
import uiZH from '@youknown/react-ui/src/locales/zh.json'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'zh',
    resources: {
      zh: {
        translation: {
          ...uiZH,
          ...rteZH
        }
      },
      en: {
        translation: {
          ...uiEN,
          ...rteEN
        }
      }
    }
  })
