import { useBoolean, useFetch } from '@youknown/react-hook/src'
import {
  AspectRatio,
  Avatar,
  Button,
  Divider,
  Image,
  Input,
  Loading,
  Space,
  Toast,
  Upload
} from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RiUserFollowLine, RiUserUnfollowLine } from 'react-icons/ri'
import { TbUserCheck, TbUserEdit, TbX } from 'react-icons/tb'
import { useSearchParams } from 'react-router-dom'

import { follow_user, get_user_info, unfollow_user, update_profile } from '@/apis/user'
import Header from '@/app/components/header'
import TabBar from '@/app/components/tab-bar'
import { IMAGE_ACCEPT } from '@/consts'
import { useModalStore, useRecordStore, useUIStore, useUserStore } from '@/stores'
import { format_time } from '@/utils'
import { upload_cloudflare_r2 } from '@/utils/cloudflare-r2'
import { with_api } from '@/utils/request'

import Entires from './components/entries'
import MyOptions from './components/my-options'

export default function UserCenter() {
  const { t } = useTranslation()
  const is_mobile = useUIStore(state => state.is_mobile)
  const profile = useUserStore(state => state.profile)
  const set_profile = useUserStore(state => state.set_profile)
  const has_login = useUserStore(state => state.has_login)
  const open_login_modal = useModalStore(state => state.open_login_modal)
  const recording = useRecordStore(state => state.recording)
  const [search_params] = useSearchParams()
  const target_user_id = search_params.get('target_user_id') ?? ''
  const is_self = !target_user_id || target_user_id === profile?.user_id
  const { data: target_user_info, mutate: set_user_info } = useFetch(get_user_info, {
    ready: !!target_user_id,
    params: [{ user_id: target_user_id }]
  })
  const user_info = is_self ? { ...profile, collected: false } : target_user_info
  const [is_editing, { setTrue: start_edit, setFalse: stop_edit }] = useBoolean(false)
  const [updating_avatar, set_updating_avatar] = useState('')
  const [follow_loading, set_follow_loading] = useState(false)
  const [unfollow_loading, set_unfollow_loading] = useState(false)

  const upload_avatar = (file: File) =>
    new Promise<string>((resolve, reject) => {
      Image.crop({
        file,
        title: t('heading.set_avatar'),
        cropShape: 'round',
        initialAspectRatio: 1,
        aspectRatioFixed: true,
        onCancel: reject,
        async onCrop(result) {
          try {
            const { compressImage } = await import('@youknown/img-wasm/src')
            const compressed_file = await compressImage(result, 520, 520)
            upload_cloudflare_r2(compressed_file, {
              complete(url) {
                resolve(url)
                set_updating_avatar(url)
              },
              error(err) {
                Toast.error(t('upload.img.fail'))
                reject(err)
              }
            })
          } catch (err) {
            Toast.error(t('upload.img.fail'))
            reject(err)
          }
        }
      })
    })

  const [nickname_val, set_nickname_val] = useState('')

  const { nickname = '', avatar = '' } = user_info ?? {}
  useEffect(() => {
    if (is_editing) {
      set_nickname_val(nickname ?? '')
      set_updating_avatar(avatar ?? '')
    }
  }, [avatar, is_editing, nickname])

  const [saving, set_saving] = useState(false)
  const handle_save_profile = async () => {
    set_saving(true)
    const [err, new_profile] = await with_api(update_profile)({
      nickname: nickname_val,
      avatar: updating_avatar
    })
    set_saving(false)
    if (err) {
      return
    }
    Toast.success(t('profile.update'))
    set_profile(new_profile)
    stop_edit()
  }

  const record_follow_user = (action: string) => {
    if (user_info && user_info.user_id && user_info?.nickname) {
      recording({
        action,
        target: '',
        target_id: '',
        obj_type: 'record.user',
        obj: user_info.nickname,
        obj_id: user_info.user_id
      })
    }
  }

  const handle_follow_user = async () => {
    if (!has_login) {
      open_login_modal()
      return
    }
    const target_user_id = user_info?.user_id
    if (!target_user_id) {
      return
    }
    set_follow_loading(true)
    const [err] = await with_api(follow_user)({
      user_id: target_user_id
    })
    if (err) {
      return
    }
    record_follow_user('record.follow')
    set_follow_loading(false)
    Toast.success(t('follow.ok.success'))
    set_user_info(p => (p ? { ...p, collected: true } : p))
  }

  const handle_unfollow_user = async () => {
    if (!has_login) {
      open_login_modal()
      return
    }
    const target_user_id = user_info?.user_id
    if (!target_user_id) {
      return
    }
    set_unfollow_loading(true)
    const [err] = await with_api(unfollow_user)({
      user_id: target_user_id
    })
    set_unfollow_loading(false)
    if (err) {
      return
    }
    record_follow_user('record.unfollow')
    Toast.success(t('follow.cancel.success'))
    set_user_info(p => (p ? { ...p, collected: false } : p))
  }

  const header = (
    <Header heading={t('page.title.personal')}>
      {has_login &&
        is_self &&
        (is_editing ? (
          <Space>
            {is_mobile ? (
              <>
                <Button text square onClick={stop_edit}>
                  <TbX className="text-18px color-primary" />
                </Button>
                <Button text square loading={saving} onClick={handle_save_profile}>
                  <TbUserCheck className="text-18px color-primary" />
                </Button>
              </>
            ) : (
              <>
                <Button onClick={stop_edit}>{t('cancel.text')}</Button>
                <Button
                  primary
                  prefixIcon={<TbUserCheck className="text-16px" />}
                  loading={saving}
                  onClick={handle_save_profile}
                >
                  {t('save.text')}
                </Button>
              </>
            )}
          </Space>
        ) : (
          <>
            {is_mobile ? (
              <Button text square onClick={start_edit}>
                <TbUserEdit className="color-primary text-18px" />
              </Button>
            ) : (
              <Button prefixIcon={<TbUserEdit className="text-16px color-primary" />} onClick={start_edit}>
                {t('profile.edit')}
              </Button>
            )}
          </>
        ))}
    </Header>
  )

  const banner = (
    <Loading className="w-100%!" spinning={!user_info}>
      <AspectRatio ratio={is_mobile ? 0.4 : 0.2}>
        <div
          className={cls(
            'relative w-100% h-100%',
            'after:content-empty after:absolute after:top-0 after:left-0 after:w-100% after:h-100%',
            'after:backdrop-blur-2xl'
          )}
        >
          {(!is_self || (is_self && has_login)) && (
            <Image className="w-100% h-100%" src={user_info?.avatar ?? ''} alt="Banner" />
          )}
        </div>
      </AspectRatio>
    </Loading>
  )

  const follow_btn = !is_self && user_info && (
    <>
      {user_info.collected ? (
        <Button
          className="z-22 absolute! top--45px right-32px"
          prefixIcon={<RiUserUnfollowLine className="text-14px" />}
          round={is_mobile}
          loading={unfollow_loading}
          onClick={handle_unfollow_user}
        >
          {t('follow.cancel.text')}
        </Button>
      ) : (
        <Button
          className="z-22 absolute! top--45px right-32px"
          prefixIcon={<RiUserFollowLine className="text-14px" />}
          round={is_mobile}
          loading={follow_loading}
          primary
          onClick={handle_follow_user}
        >
          {t('follow.text')}
        </Button>
      )}
    </>
  )

  return (
    <>
      {header}
      {banner}

      <div className="relative sm:p-32px <sm:p-[32px_0] sm:w-720px sm:m-[0_auto]">
        {follow_btn}

        {is_self && !has_login ? (
          <div
            className={cls(
              'absolute top--45px w-90px h-90px flex justify-center items-center',
              'rd-full bg-primary color-#fff text-16px font-500 shadow-shadow-l'
            )}
            onClick={open_login_modal}
          >
            {t('login.go')}
          </div>
        ) : (
          <>
            {is_editing ? (
              <Upload
                className="absolute! top--45px <sm:left-16px"
                circle
                accept={IMAGE_ACCEPT}
                action={upload_avatar}
              />
            ) : (
              <Avatar
                className="absolute! top--45px <sm:left-16px shadow-shadow-l"
                size={90}
                round
                bordered
                canPreview
                src={user_info?.avatar}
              />
            )}
          </>
        )}

        {is_editing ? (
          <Input className="<sm:ml-16px mt-24px" value={nickname_val} onChange={set_nickname_val} />
        ) : (
          <div className="<sm:ml-16px text-22px line-height-32px font-600 mt-24px break-all line-clamp-2">
            {user_info?.nickname ?? '--'}
          </div>
        )}

        <div className="text-12px color-text-3 mt-8px <sm:p-[0_16px_16px_16px]">
          {t('time.join')}
          {format_time(user_info?.creation_time ?? '--')}
        </div>
        {is_mobile || <Divider />}

        {is_mobile && is_self && (
          <div className="p-16px bg-bg-2">
            <Entires />
            <MyOptions />
          </div>
        )}
      </div>

      {is_mobile && <TabBar />}
    </>
  )
}
