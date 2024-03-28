import type { FormInstance } from '@youknown/react-hook/src'
import { useBoolean } from '@youknown/react-hook/src'
import { Button, Form, Input, Motion, Select, Space } from '@youknown/react-ui/src'
import { cls, storage } from '@youknown/utils/src'
import type { Ref } from 'react'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { flushSync } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { RiFilter3Fill } from 'react-icons/ri'
import { TbChevronDown, TbSearch } from 'react-icons/tb'

import { validate_arr_required } from '@/utils/validators'

export const enum SWITCH {
  ON = 1,
  OFF = 0
}
export const enum CATE {
  GENERAL = 1,
  ANIME = 2,
  PEOPLE = 3
}
export const enum PURITY {
  SFW = 1,
  SKETCHY = 2,
  NSFW = 3
}
export const enum ORDER {
  DESC = 'desc',
  ASC = 'asc'
}
export interface filterState {
  ai_art_filter: SWITCH
  categories: CATE[]
  purity: PURITY[]
  atleast: string
  ratios: string
  sorting: string
  topRange: string
  order: string
}

export type WallpaperQuery = Omit<filterState, 'categories' | 'purity'> & {
  keywords: string
  categories: string
  purity: string
}

interface WallpaperFilerProps {
  form: FormInstance<filterState>
  loading: boolean
  keywords: string
  on_keywords_input: (keywords: string) => void
  on_search: (keywords: string) => void
  on_reset: () => void
}
export interface ImperativeHandle {
  focus_keywords_input: () => void
}

function WallpaperFilter(props: WallpaperFilerProps, ref: Ref<ImperativeHandle>) {
  const { form, keywords, on_keywords_input, loading, on_search, on_reset } = props

  const { t } = useTranslation()
  const [filter_open, { setReverse: toggle_filter }] = useBoolean(true)
  const keywords_input_ref = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => ({
    focus_keywords_input() {
      keywords_input_ref.current?.focus()
    }
  }))

  const { sorting } = form.getState()
  const at_least_options = [
    {
      label: t('unlimited.resolution'),
      value: '0x0'
    },
    '-',
    t('screen.vertical'),
    {
      label: `${t('atleast')} 1080x2340`,
      value: '1080x2340'
    },
    {
      label: `${t('atleast')} 1284x2778`,
      value: '1284x2778'
    },
    '21 x 9',
    {
      label: `${t('atleast')} 2560x1080`,
      value: '2560x1080'
    },
    {
      label: `${t('atleast')} 3440x1440`,
      value: '3440x1440'
    },
    {
      label: `${t('atleast')} 5120x2160`,
      value: '5120x2160'
    },
    '16 x 9',
    {
      label: `${t('atleast')} 1920x1080`,
      value: '1920x1080'
    },
    {
      label: `${t('atleast')} 2560x1440`,
      value: '2560x1440'
    },
    {
      label: `${t('atleast')} 3840x2160`,
      value: '3840x2160'
    },
    '16 x 10',
    {
      label: `${t('atleast')} 1920x1440`,
      value: '1920x1440'
    },
    {
      label: `${t('atleast')} 2560x1920`,
      value: '2560x1920'
    },
    {
      label: `${t('atleast')} 3840x2880`,
      value: '3840x2880'
    }
  ]

  const purity_options = [
    {
      label: 'SFW',
      value: PURITY.SFW
    },
    {
      label: 'SKETCHY',
      value: PURITY.SKETCHY
    }
  ]
  if (storage.local.get('nsfw')) {
    purity_options.push({
      label: 'NSFW',
      value: PURITY.NSFW
    })
  }

  return (
    <>
      <div className="flex flex-row-reverse ml-16px mr-16px">
        <Space className="<sm:flex-1" wrap={false}>
          <Input
            className="<sm:w-100%!"
            ref={keywords_input_ref}
            prefix={<TbSearch className="color-text-3" />}
            placeholder={t('placeholder.keywords')}
            allowClear
            value={keywords}
            onChange={on_keywords_input}
            onEnter={on_search}
          />
          <Button prefixIcon={<RiFilter3Fill className="text-16px" />} onClick={toggle_filter}>
            <div className="flex items-center">
              <span className="whitespace-nowrap">{t('filter.tool')}</span>
              <TbChevronDown className={cls('ml-16px transition-transform', filter_open && 'rotate-180deg')} />
            </div>
          </Button>
        </Space>
      </div>
      <Motion.Collapse in={filter_open} mountOnEnter>
        <div className="m-16px p-32px b-1 b-solid b-divider rd-radius-m bg-bg-2 shadow-shadow-m">
          <Form form={form} layout="inline">
            <Form.Field label="ai_art_filter">
              <Select
                className="w-240px!"
                menuList={[
                  {
                    label: t('form.ai'),
                    value: SWITCH.OFF
                  },
                  {
                    label: t('form.no_ai'),
                    value: SWITCH.ON
                  }
                ]}
              />
            </Form.Field>

            <Form.Field label="categories" validators={[validate_arr_required()]}>
              <Select
                className="w-240px!"
                multiple
                menuList={[
                  {
                    label: t('form.general'),
                    value: CATE.GENERAL
                  },
                  {
                    label: t('form.anime'),
                    value: CATE.ANIME
                  },
                  {
                    label: t('form.people'),
                    value: CATE.PEOPLE
                  }
                ]}
              />
            </Form.Field>

            <Form.Field label="purity" validators={[validate_arr_required()]}>
              <Select className="w-240px!" multiple menuList={purity_options} />
            </Form.Field>

            <div className="w-100%"></div>

            <Form.Field label="ratios">
              <Select
                className="w-240px!"
                menuList={[
                  {
                    label: t('unlimited.aspect_ratio'),
                    value: ''
                  },
                  '-',
                  {
                    label: t('limited.landscape'),
                    value: 'landscape'
                  },
                  {
                    label: t('limited.portrait'),
                    value: 'portrait'
                  },
                  '-',
                  {
                    label: '21 : 9',
                    value: '21x9'
                  },
                  {
                    label: '16 : 9',
                    value: '16x9'
                  },
                  {
                    label: '4 : 3',
                    value: '4x3'
                  },
                  {
                    label: '9 : 19.5',
                    value: '9x19.5'
                  }
                ]}
              />
            </Form.Field>

            <Form.Field label="atleast">
              <Select className="w-240px!" menuList={at_least_options} />
            </Form.Field>

            <div className="w-100%"></div>

            <Form.Field label="sorting">
              <Select
                className="w-240px!"
                menuList={[
                  {
                    label: t('form.top_list'),
                    value: 'toplist'
                  },
                  {
                    label: t('form.views'),
                    value: 'views'
                  },
                  {
                    label: t('form.favorites'),
                    value: 'favorites'
                  },
                  {
                    label: t('form.hot'),
                    value: 'hot'
                  },
                  {
                    label: t('form.date_added'),
                    value: 'date_added'
                  },
                  {
                    label: t('form.relevance'),
                    value: 'relevance'
                  },
                  {
                    label: t('form.random'),
                    value: 'random'
                  }
                ]}
              />
            </Form.Field>

            {sorting === 'toplist' && (
              <Form.Field label="topRange">
                <Select
                  className="w-240px!"
                  menuList={[
                    {
                      label: t('time.yesterday'),
                      value: '1d'
                    },
                    {
                      label: t('time.last_week'),
                      value: '1w'
                    },
                    {
                      label: t('time.last_month'),
                      value: '1M'
                    },
                    {
                      label: t('time.nearly_3_months'),
                      value: '3M'
                    },
                    {
                      label: t('time.nearly_half_a_year'),
                      value: '6M'
                    },
                    {
                      label: t('time.nearly_a_year'),
                      value: '1y'
                    }
                  ]}
                />
              </Form.Field>
            )}

            {sorting === 'random' || (
              <Form.Field label="order">
                <Select
                  className="w-240px!"
                  menuList={[
                    {
                      label: t('form.desc'),
                      value: ORDER.DESC
                    },
                    {
                      label: t('form.asc'),
                      value: ORDER.ASC
                    }
                  ]}
                />
              </Form.Field>
            )}
          </Form>

          <Space size="large">
            <Button
              onClick={() => {
                form.reset()
                flushSync(() => {
                  on_keywords_input('')
                })
                on_reset()
              }}
            >
              {t('reset.condition')}
            </Button>
            <Button primary prefixIcon={<TbSearch />} loading={loading} onClick={form.submit}>
              {t('filter.text')}
            </Button>
          </Space>
        </div>
      </Motion.Collapse>
    </>
  )
}

export default forwardRef(WallpaperFilter)
