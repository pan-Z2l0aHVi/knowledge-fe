import { useBoolean, useContextMenu, useFetch } from '@youknown/react-hook/src'
import { ContextMenu, Dialog, Dropdown, Image, Loading, Motion, Tag, Toast, Tooltip } from '@youknown/react-ui/src'
import { cls, downloadFile, QS } from '@youknown/utils/src'
import copy from 'copy-to-clipboard'
import { Fragment, memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CgSpinner } from 'react-icons/cg'
import { FiDownloadCloud, FiInfo } from 'react-icons/fi'
import { LuHeart, LuHeartOff } from 'react-icons/lu'
import { MdContentCopy } from 'react-icons/md'
import { RxDotsHorizontal } from 'react-icons/rx'
import { TbEyeCheck, TbPhotoSearch } from 'react-icons/tb'

import { cancel_collect_wallpaper, collect_wallpaper } from '@/apis/user'
import type { Wallpaper, WallpaperTag } from '@/apis/wallpaper'
import { get_wallpaper_info } from '@/apis/wallpaper'
import { is_dark_theme_getter, useModalStore, useRecordStore, useUIStore, useUserStore } from '@/stores'
import { format_file_size, format_time } from '@/utils'
import { find_wallpaper_seen, insert_wallpaper_seen } from '@/utils/idb'
import { with_api } from '@/utils/request'

interface WallpaperCardProps {
  className?: string
  wallpaper: Wallpaper
  on_removed?: () => void
}

function WallpaperCard(props: WallpaperCardProps) {
  const { className, wallpaper, on_removed } = props

  const { t } = useTranslation()
  const is_dark_theme = useUIStore(is_dark_theme_getter)
  const has_login = useUserStore(state => state.has_login)
  const open_login_modal = useModalStore(state => state.open_login_modal)
  const recording = useRecordStore(state => state.recording)
  const [hovered, { setTrue: start_hover, setFalse: stop_hover }] = useBoolean(false)
  const [more_open, { setBool: set_more_open }] = useBoolean(false)
  const [img_loaded, { setTrue: set_img_loaded }] = useBoolean(false)
  const { data: seen, run: get_seen } = useFetch(find_wallpaper_seen, {
    params: [wallpaper.id]
  })
  const wallpaper_collected = wallpaper.collected
  const [collected, set_collected] = useState(wallpaper_collected)
  useEffect(() => {
    set_collected(wallpaper_collected)
  }, [wallpaper_collected])

  const record_collect_wallpaper = (action: string) => {
    recording({
      action,
      target: '',
      target_id: '',
      obj_type: 'record.wallpaper',
      obj: wallpaper.path,
      obj_id: wallpaper.id
    })
  }

  const add_to_collection = async () => {
    if (!has_login) {
      open_login_modal()
      return
    }
    const [err] = await with_api(collect_wallpaper)({
      wallpaper
    })
    if (err) {
      return
    }
    record_collect_wallpaper('record.collect')
    Toast.success(t('collect.success'))
    set_collected(true)
  }
  const remove_from_collection = async () => {
    if (!has_login) {
      open_login_modal()
      return
    }
    const [err] = await with_api(cancel_collect_wallpaper)({
      wallpaper_id: wallpaper.id
    })
    if (err) {
      return
    }
    record_collect_wallpaper('record.cancel_collect')
    Toast.success(t('collect.cancel.success'))
    set_collected(false)
    on_removed?.()
  }

  const toast_download_err = () => {
    Toast.error(t('download.fail_and_copy'))
  }
  const handle_download = () => {
    downloadFile(wallpaper.path, wallpaper.id).catch(() => {
      toast_download_err()
    })
  }

  const preview_picture = async () => {
    Image.preview({
      url: wallpaper.path,
      downloadFileName: wallpaper.id,
      onDownloadError() {
        toast_download_err()
      },
      async onLoad() {
        await insert_wallpaper_seen(wallpaper.id)
        get_seen()
      }
    })
  }
  const is_sketchy = wallpaper.purity === 'sketchy'
  const is_nsfw = wallpaper.purity === 'nsfw'

  const [menu_open, set_menu_open] = useState(false)
  const ctx_menu = useContextMenu(menu_open, set_menu_open)

  const render_detail_content = (detail: Wallpaper) => {
    const format_tag_color_cls = (tag: WallpaperTag) => {
      return (
        {
          sfw: 'color-emerald!',
          sketchy: 'color-yellow!',
          nsfw: 'color-red!'
        }[tag.purity] ?? ''
      )
    }
    const format_cate = () => {
      return {
        general: t('form.general'),
        anime: t('form.anime'),
        people: t('form.people')
      }[detail.category]
    }

    const info_list = [
      {
        label: t('created_at'),
        value: format_time(detail.created_at)
      },
      {
        label: t('size'),
        value: format_file_size(detail.file_size)
      },
      {
        label: t('cate'),
        value: format_cate()
      },
      {
        label: t('form.views'),
        value: detail.views
      },
      {
        label: t('form.favorites'),
        value: detail.favorites
      }
    ]

    return (
      <div className="p-24px">
        <div className="text-center font-600 text-18px mb-16px">
          {detail.dimension_x} x {detail.dimension_y}
        </div>

        <div className="grid grid-cols-2 items-center gap-x-12px gap-y-4px text-12px mb-8px">
          {info_list.map(item => (
            <Fragment key={item.label}>
              <div className="w2-50% text-right color-text-3">{item.label}</div>
              <div className="w2-50% text-left color-text-2">{item.value}</div>
            </Fragment>
          ))}
        </div>

        <div className="font-600 text-16px mb-8px">{t('tags')}</div>
        <div className="flex flex-wrap m--4px">
          {detail.tags?.map(tag => {
            return (
              <Tag key={tag.id} className={cls('m-4px', format_tag_color_cls(tag))}>
                {tag.name}
              </Tag>
            )
          })}
        </div>
      </div>
    )
  }

  const { run: fetch_detail, loading } = useFetch(get_wallpaper_info, {
    params: [{ url: wallpaper.url }],
    manual: true,
    onSuccess(data) {
      Dialog.confirm({
        content: render_detail_content(data),
        footer: null,
        header: null,
        className: 'w-480px! max-w-[calc(100vw-32px)]',
        overlayClassName: cls(
          'backdrop-blur-xl',
          is_dark_theme ? '!bg-[rgba(0,0,0,0.2)]' : '!bg-[rgba(255,255,255,0.2)]'
        )
      })
      Dropdown.close()
      set_menu_open(false)
    }
  })

  const search_similar = () => {
    const similar_keywords = `like:${wallpaper.id}`
    window.open(
      QS.stringify({
        base: '/wallpapers',
        query: {
          keywords: similar_keywords
        }
      }),
      '_blank'
    )
  }

  const get_dropdown_menu = (is_context_menu = false) => {
    return (
      <Dropdown.Menu
        className="min-w-120px"
        onClick={stop_hover}
        closeAfterItemClick
        closeDropdown={is_context_menu ? ctx_menu.closeContextMenu : undefined}
      >
        <Dropdown.Item
          closeAfterItemClick={false}
          prefix={
            loading ? (
              <Loading icon={<CgSpinner className="color-primary text-16px" />} spinning />
            ) : (
              <FiInfo className="text-16px" />
            )
          }
          onClick={fetch_detail}
        >
          {t('view.detail')}
        </Dropdown.Item>

        <Dropdown.Item prefix={<FiDownloadCloud className="text-16px" />} onClick={handle_download}>
          {t('download.original_img')}
        </Dropdown.Item>

        <Dropdown.Item
          prefix={<MdContentCopy className="text-16px" />}
          onClick={() => {
            copy(wallpaper.path)
            Toast.success(t('copy.original_img.success'))
          }}
        >
          {t('copy.original_img.text')}
        </Dropdown.Item>

        <Dropdown.Item prefix={<TbPhotoSearch className="text-16px" />} onClick={search_similar}>
          {t('find.similar')}
        </Dropdown.Item>

        {collected ? (
          <Dropdown.Item prefix={<LuHeartOff className="text-16px color-danger" />} onClick={remove_from_collection}>
            <span className="color-danger">{t('collect.cancel.text')}</span>
          </Dropdown.Item>
        ) : (
          <Dropdown.Item prefix={<LuHeart className="text-16px" />} onClick={add_to_collection}>
            {t('collect.text')}
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    )
  }

  const seen_ele = (
    <>
      {seen && (
        <Tooltip placement="bottom" title={t('seen')}>
          <div
            className={cls(
              'absolute top-8px right-8px flex items-center justify-center',
              'leading-none w-24px h-24px rd-full bg-[rgba(120,120,120,0.4)] backdrop-blur-xl'
            )}
          >
            <TbEyeCheck className="text-16px color-#fff" />
          </div>
        </Tooltip>
      )}
    </>
  )

  const operator_bar = (
    <>
      {img_loaded && (
        <>
          <Motion.Fade in={hovered && !more_open}>
            <div
              className={cls(
                'absolute bottom-8px left-8px',
                'rd-full bg-[rgba(120,120,120,0.4)] backdrop-blur-xl',
                'flex items-center h-24px leading-none pl-6px pr-6px text-12px color-#fff',
                'pointer-events-none'
              )}
            >
              {wallpaper.dimension_x} X {wallpaper.dimension_y}
            </div>
          </Motion.Fade>

          <Dropdown trigger="click" spacing={4} content={get_dropdown_menu()} onOpenChange={set_more_open}>
            <Motion.Fade in={hovered || more_open}>
              <div
                className={cls(
                  'absolute bottom-8px right-8px',
                  'rd-full bg-[rgba(120,120,120,0.4)] backdrop-blur-xl',
                  '[@media(hover:hover)]-hover-bg-primary active-bg-primary',
                  'flex items-center justify-center w-24px h-24px cursor-pointer select-none'
                )}
                onClick={start_hover}
              >
                <RxDotsHorizontal className="color-#fff text-16px" />
              </div>
            </Motion.Fade>
          </Dropdown>
        </>
      )}
    </>
  )

  const BASE_PIXEL = 320
  let image_w: number
  let image_h: number
  const aspect_ratio = Number(wallpaper.ratio)
  if (aspect_ratio > 1) {
    image_w = BASE_PIXEL
    image_h = BASE_PIXEL / aspect_ratio
  } else {
    image_w = BASE_PIXEL * aspect_ratio
    image_h = BASE_PIXEL
  }

  return (
    <>
      <figure
        className={cls(
          'relative inline-block align-middle m-8px',
          'before:content-empty before:rd-radius-m before:pointer-events-none before:absolute before:left-0 before:right-0 before:top-0 before:bottom-0',
          {
            'before:b-2 before:b-solid before:b-yellow': is_sketchy,
            'before:b-2 before:b-solid before:b-red': is_nsfw
          },
          className
        )}
        onMouseEnter={start_hover}
        onMouseLeave={stop_hover}
        onContextMenu={ctx_menu.onContextMenu}
      >
        <Image
          className={cls('rd-radius-m shadow-shadow-s select-none bg-bg-2 b-divider b-1')}
          style={{
            width: image_w,
            height: image_h
          }}
          src={wallpaper.thumbs.original}
          alt="Wallpaper thumb"
          loading="lazy"
          onLoad={set_img_loaded}
          onClick={preview_picture}
        />

        {seen_ele}
        {operator_bar}
      </figure>

      <ContextMenu {...ctx_menu.contextMenuProps}>{get_dropdown_menu(true)}</ContextMenu>
    </>
  )
}

export default memo(WallpaperCard)
