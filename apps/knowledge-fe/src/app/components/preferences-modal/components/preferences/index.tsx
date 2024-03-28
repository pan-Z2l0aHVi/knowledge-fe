import { Form, Select, Space } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { isEqual } from 'lodash-es'
import { useTranslation } from 'react-i18next'

import { I18N_LANG, THEME, useUIStore } from '@/stores'

const { t } = await import('i18next')
const style_options: StyleItem[] = [
  {
    id: 1,
    radius: [0, 0, 0],
    desc: () => t('setting.right_angle')
  },
  {
    id: 2,
    radius: [2, 4, 6],
    desc: () => t('setting.corners')
  },
  {
    id: 3,
    radius: [4, 8, 12],
    desc: () => t('setting.large_corners')
  }
]
const hue_options = ['#007aff', '#af52de', '#e55b9d', '#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#8e8e93']

interface StyleItem {
  id: 1 | 2 | 3
  radius: [number, number, number]
  desc: () => string
}
interface RadiusStyleProps {
  value?: StyleItem
  onChange?: (value: StyleItem) => void
}
function RadiusStyle(props: RadiusStyleProps) {
  const { value, onChange } = props
  if (value == null) return null

  return (
    <Space>
      {style_options.map(style => {
        const handleSelect = () => {
          onChange?.(style)
        }
        return (
          <div key={style.id} className="select-none cursor-pointer" onClick={handleSelect}>
            <div
              className={cls(
                'relative w-64px h-64px rd-radius-m overflow-hidden bg-bg-3',
                'before:absolute before:right--42% before:bottom--36% before:w-100% before:h-100% before:content-empty',
                'before:b-t-1 before:b-l-1 before:b-divider before:b-solid before:shadow-shadow-m before:bg-bg-1',
                style.id === 1 && 'before:rd-3px',
                style.id === 2 && 'before:rd-6px',
                style.id === 3 && 'before:rd-9px',
                value.id === style.id
                  ? 'b-1 b-solid b-primary shadow-[0_0_0_1px_var(--ui-color-primary)]'
                  : 'b-1 b-solid b-divider'
              )}
            ></div>
            <div className="color-text-2 mt-4px text-center max-w-64px">{style.desc()}</div>
          </div>
        )
      })}
    </Space>
  )
}

interface HueProps {
  value?: string
  onChange?: (value: string) => void
}
function Hue(props: HueProps) {
  const { value, onChange } = props
  if (value == null) return null

  return (
    <Space className="flex-wrap!">
      {hue_options.map(color => {
        const handleSelect = () => {
          onChange?.(color)
        }
        return (
          <div
            key={color}
            className={cls(
              'relative w-24px h-24px rd-full b-1 b-solid b-[rgba(0,0,0,0.1)] cursor-pointer',
              'mb-4px mt-4px',
              'before:absolute before:top-6px before:left-6px before:w-10px before:h-10px before:rd-full before:content-empty',
              value === color && 'before:bg-#fff before:shadow-shadow-s'
            )}
            style={{ backgroundColor: color }}
            onClick={handleSelect}
          ></div>
        )
      })}
    </Space>
  )
}

export default function Preferences() {
  const { t } = useTranslation()
  const theme = useUIStore(state => state.theme)
  const primary_color = useUIStore(state => state.primary_color)
  const radius = useUIStore(state => state.radius)
  const i18n_lang = useUIStore(state => state.i18n_lang)
  const set_radius = useUIStore(state => state.set_radius)
  const set_primary_color = useUIStore(state => state.set_primary_color)
  const set_theme = useUIStore(state => state.set_theme)
  const set_i18n_lang = useUIStore(state => state.set_i18n_lang)

  const form = Form.useForm({
    defaultState: {
      style: style_options.find(opt => isEqual(opt.radius, radius)) as StyleItem,
      hue: primary_color,
      theme,
      lang: i18n_lang
    },
    onStateChange(org) {
      const state = form.getState()

      switch (org.label) {
        case 'style':
          set_radius(state.style.radius)
          break

        case 'hue':
          set_primary_color(state.hue)
          break

        case 'theme':
          set_theme(state.theme)
          break

        case 'lang':
          set_i18n_lang(state.lang)
          break

        default:
          break
      }
    }
  })

  return (
    <Form className="sm:p-[24px_24px_0_24px] <sm:p-[24px_16px_0_16px]" form={form} labelWidth={108}>
      <Form.Field label="style" labelText={t('setting.ui_style')}>
        <RadiusStyle />
      </Form.Field>
      <Form.Field label="hue" labelText={t('setting.hue')}>
        <Hue />
      </Form.Field>
      <Form.Field label="theme" labelText={t('setting.theme')}>
        <Select
          menuList={[
            {
              label: t('setting.light'),
              value: THEME.LIGHT
            },
            {
              label: t('setting.dark'),
              value: THEME.DARK
            },
            {
              label: t('setting.system'),
              value: THEME.SYSTEM
            }
          ]}
        />
      </Form.Field>
      <Form.Field label="lang" labelText={t('setting.language')}>
        <Select
          menuList={[
            {
              label: '简体中文',
              value: I18N_LANG.ZH
            },
            {
              label: 'English',
              value: I18N_LANG.EN
            },
            {
              label: t('setting.system'),
              value: I18N_LANG.SYSTEM
            }
          ]}
        />
      </Form.Field>
    </Form>
  )
}
