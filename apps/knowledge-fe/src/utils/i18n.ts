import resources_to_backend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next'

const { default: i18next, changeLanguage } = await import('i18next')

export const change_i18n_lang = changeLanguage

const init_i18n = async () => {
  i18next.use(initReactI18next).use(
    resources_to_backend(async (language: string) => {
      if (language === 'dev') {
        return
      }
      // Why not "locales/${language}.json"?
      // Vite Rollup dynamic-import-vars 引入依赖会报错，暂时用不那么优雅的方式处理
      let deps_pkgs: Promise<unknown>[] = []
      if (language === 'en') {
        deps_pkgs = [
          import('@youknown/react-ui/src/locales/en.json').then(res_2 => res_2.default),
          import('@youknown/react-rte/src/locales/en.json').then(res_3 => res_3.default)
        ]
      } else if (language === 'zh') {
        deps_pkgs = [
          import('@youknown/react-ui/src/locales/zh.json').then(res_4 => res_4.default),
          import('@youknown/react-rte/src/locales/zh.json').then(res_5 => res_5.default)
        ]
      }
      const pkgs = await Promise.all([import(`@/locales/${language}.json`).then(res_6 => res_6.default), ...deps_pkgs])
      return pkgs.reduce(
        (pre, cur) => ({
          ...pre,
          ...cur
        }),
        {}
      )
    })
  )

  await i18next.init({
    fallbackLng: 'zh',
    debug: import.meta.env.MODE === 'development'
  })
}
init_i18n()
