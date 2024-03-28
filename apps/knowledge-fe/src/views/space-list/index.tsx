import { useBoolean } from '@youknown/react-hook/src'
import { Button, Toast } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GoInbox } from 'react-icons/go'
import { TbFolderPlus } from 'react-icons/tb'

import Header from '@/app/components/header'
import TabBar from '@/app/components/tab-bar'
import { useModalStore, useSpaceStore, useUIStore, useUserStore } from '@/stores'
import { with_api } from '@/utils/request'

import SpaceCard from './components/space-card'
import SpaceOptionsModal from './components/space-options-modal'

export default function SpaceList() {
  const { t } = useTranslation()
  const is_mobile = useUIStore(state => state.is_mobile)
  const has_login = useUserStore(state => state.has_login)
  const open_login_modal = useModalStore(state => state.open_login_modal)
  const space_list = useSpaceStore(state => state.space_list)
  const create_space = useSpaceStore(state => state.create_space)
  const update_space = useSpaceStore(state => state.update_space)
  const [options_modal_open, { setTrue: show_options_modal, setFalse: hide_options_modal }] = useBoolean(false)
  const [modal_space_id, set_modal_space_id] = useState('')

  const create_new_space = async (name: string, desc: string) => {
    const [err] = await with_api(create_space)(name, desc)
    if (err) {
      return
    }
    Toast.success(t('save.success'))
    hide_options_modal()
  }

  const update_doc_space = async (name: string, desc: string) => {
    const [err] = await with_api(update_space)(modal_space_id, name, desc)
    if (err) {
      return
    }
    hide_options_modal()
  }

  const handle_show_create_modal = () => {
    if (!has_login) {
      open_login_modal()
      return
    }
    set_modal_space_id('')
    show_options_modal()
  }

  const spaces_ele = space_list.map(space => {
    return (
      <SpaceCard
        key={space.space_id}
        info={space}
        on_edit={() => {
          set_modal_space_id(space.space_id)
          show_options_modal()
        }}
      />
    )
  })

  return (
    <>
      <Header heading={t('page.title.library')}>
        {is_mobile ? (
          <Button square text onClick={handle_show_create_modal}>
            <TbFolderPlus className="text-18px color-primary" />
          </Button>
        ) : (
          <Button primary prefixIcon={<TbFolderPlus className="text-16px" />} onClick={handle_show_create_modal}>
            {t('space.create')}
          </Button>
        )}
      </Header>

      {space_list.length ? (
        <div
          className={cls(
            'grid gap-16px justify-center sm:p-[16px_32px_32px_32px] <sm:p-16px',
            'sm:grid-cols-[repeat(auto-fill,400px)] <sm:grid-cols-[repeat(auto-fill,100%)]'
          )}
        >
          {spaces_ele}
        </div>
      ) : (
        <div className="flex flex-col items-center color-text-3 mt-40px">
          <GoInbox className="text-32px mb-16px" />
          <div>{t('space.empty_tip')}</div>
        </div>
      )}

      <SpaceOptionsModal
        open={options_modal_open}
        hide_modal={hide_options_modal}
        space_id={modal_space_id}
        on_save={async (name, desc) => {
          const is_edit = !!modal_space_id
          if (is_edit) {
            await update_doc_space(name, desc)
          } else {
            await create_new_space(name, desc)
          }
        }}
      />

      {is_mobile && <TabBar />}
    </>
  )
}
