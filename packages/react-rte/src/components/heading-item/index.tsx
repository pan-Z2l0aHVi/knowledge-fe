import './index.scss'

import type { HeadingOptions, Level } from '@tiptap/extension-heading'
import { Dropdown } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import type { IconType } from 'react-icons'
import { PiTextHFourBold, PiTextHOneBold, PiTextHThreeBold, PiTextHTwoBold, PiTextTBold } from 'react-icons/pi'
import { RiHeading } from 'react-icons/ri'
import { TbChevronRight } from 'react-icons/tb'

import type { ButtonProps } from '../../common'
import { UI_EDITOR_PREFIX } from '../../common'

interface Option<T> {
  value: T
  label: string
  icon: IconType
}
export default function HeadingPicker(props: ButtonProps<HeadingOptions>) {
  const { editor, extension } = props
  const { t } = useTranslation()

  const headingList: Option<1 | 2 | 3 | 4>[] = [
    {
      value: 1,
      label: t('react_rte.heading.1'),
      icon: PiTextHOneBold
    },
    {
      value: 2,
      label: t('react_rte.heading.2'),
      icon: PiTextHTwoBold
    },
    {
      value: 3,
      label: t('react_rte.heading.3'),
      icon: PiTextHThreeBold
    },
    {
      value: 4,
      label: t('react_rte.heading.4'),
      icon: PiTextHFourBold
    }
  ]
  const levels = extension?.options?.levels.filter(level => level >= 1 && level <= 4) ?? []
  const headingOptions = headingList.filter(heading => levels.includes(heading.value))
  const options: Option<0 | Level>[] = [
    {
      value: 0,
      label: t('react_rte.text'),
      icon: PiTextTBold
    },
    ...headingOptions
  ]

  const isMainText = (value: Option<0 | Level>['value']): value is 0 => value === 0

  const handleSelect = (opt: Option<0 | Level>) => {
    const level = opt.value
    if (!isMainText(level)) {
      editor.chain().focus().setHeading({ level }).run()
    } else {
      editor.chain().focus().toggleNode('paragraph', 'paragraph').run()
    }
  }
  const prefixCls = `${UI_EDITOR_PREFIX}-heading-item`

  const contentEle = (
    <Dropdown.Menu closeAfterItemClick>
      {options.map(opt => (
        <Dropdown.Item key={opt.value} prefix={<opt.icon size={18} />} onClick={() => handleSelect(opt)}>
          {opt.label}
        </Dropdown.Item>
      ))}
    </Dropdown.Menu>
  )

  return (
    <Dropdown trigger="hover" spacing={-2} placement="right-start" content={contentEle} appendTo={null}>
      <Dropdown.Item
        prefix={
          <div className={cls(prefixCls)}>
            <RiHeading />
          </div>
        }
        suffix={<TbChevronRight className={`${prefixCls}-chevron-icon`} />}
      >
        {t('react_rte.heading.text')}
      </Dropdown.Item>
    </Dropdown>
  )
}
