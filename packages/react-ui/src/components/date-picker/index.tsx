import './date-picker.scss'

import { useBoolean, useControllable } from '@youknown/react-hook/src'
import { cls, omit } from '@youknown/utils/src'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoMdCloseCircle } from 'react-icons/io'
import { LuChevronLeft, LuChevronRight, LuChevronsLeft, LuChevronsRight } from 'react-icons/lu'
import { TbCalendar } from 'react-icons/tb'

import { UI_PREFIX } from '../../constants'
import { Button } from '../button'
import { Divider } from '../divider'
import { Popover } from '../popover'

export interface DatePickerProps
  extends Omit<ComponentPropsWithoutRef<typeof Button>, 'defaultValue' | 'value' | 'onChange'> {
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  icon?: ReactNode
  allowClear?: boolean
  placeholder?: string
  defaultValue?: Dayjs
  value?: Dayjs
  onChange?: (value: Dayjs) => void
}

const _DatePicker = (props: DatePickerProps, ref: ForwardedRef<HTMLButtonElement>) => {
  const { t } = useTranslation()
  const prefixCls = `${UI_PREFIX}-date-picker`
  const {
    className,
    size = 'medium',
    disabled,
    icon = <TbCalendar className={`${prefixCls}-icon`} />,
    allowClear = false,
    placeholder = t('react_ui.placeholder.date'),
    onMouseEnter,
    onMouseLeave,
    ...rest
  } = omit(props, 'defaultValue', 'value', 'onChange')

  const [open, setOpen] = useState(false)
  const [dateSelection, setDateSelection] = useControllable(props, {
    defaultValue: dayjs(null)
  })
  const [currentMonth, setCurrentMonth] = useState(dayjs())
  const [isHover, { setTrue: startHover, setFalse: stopHover }] = useBoolean(false)

  const handleSelectDate = (date: Dayjs) => {
    setDateSelection(date)
  }

  const goToPreYear = () => {
    setCurrentMonth(currentMonth.subtract(1, 'year'))
  }

  const goToNextYear = () => {
    setCurrentMonth(currentMonth.add(1, 'year'))
  }

  const goToPreMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'))
  }

  const goToNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'))
  }

  const selectToday = () => {
    const today = dayjs()
    setCurrentMonth(today)
    setDateSelection(today)
    setOpen(false)
  }

  const firstDayOfMonth = currentMonth.startOf('month')
  const daysInMonth = firstDayOfMonth.daysInMonth()
  const startingDay = firstDayOfMonth.day()
  const placeholderDates: null[] = Array(startingDay).fill(null)
  const datesInMonth = Array.from({ length: daysInMonth }, (_, index) => firstDayOfMonth.add(index, 'day'))
  const dateCells: (Dayjs | null)[] = [...placeholderDates, ...datesInMonth]

  const WEEK_LIST = [
    t('react_ui.sun'),
    t('react_ui.mon'),
    t('react_ui.tue'),
    t('react_ui.wed'),
    t('react_ui.thu'),
    t('react_ui.fri'),
    t('react_ui.sat')
  ]
  const hasSelection = dateSelection && dateSelection.isValid()

  const calendar = (
    <div className={`${prefixCls}-calendar`}>
      <div className={`${prefixCls}-calendar-header`}>
        <Button size="small" square onClick={goToPreYear}>
          <LuChevronsLeft />
        </Button>
        <Button size="small" square onClick={goToPreMonth}>
          <LuChevronLeft />
        </Button>
        <div className={`${prefixCls}-calendar-header-month`}>{currentMonth.format(t('react_ui.date.year_month'))}</div>
        <Button size="small" square onClick={goToNextMonth}>
          <LuChevronRight />
        </Button>
        <Button size="small" square onClick={goToNextYear}>
          <LuChevronsRight />
        </Button>
      </div>

      <Divider size="small" />

      <div className={`${prefixCls}-calendar-body`}>
        {WEEK_LIST.map(week => (
          <div key={week} className={`${prefixCls}-calendar-week`}>
            {week}
          </div>
        ))}
        {dateCells.map((date, index) =>
          date ? (
            <div
              key={date.format('YYYY/MM/DD')}
              className={cls(`${prefixCls}-calendar-day`, {
                [`${prefixCls}-calendar-day-today`]: date.isSame(dayjs(), 'day'),
                [`${prefixCls}-calendar-day-selected`]: hasSelection && date.isSame(dateSelection, 'day')
              })}
              onClick={() => handleSelectDate(date)}
            >
              {date.format('D')}
            </div>
          ) : (
            <div key={index} className={`${prefixCls}-calendar-placeholder`}></div>
          )
        )}
      </div>

      <Divider size="small" />

      <Button className={`${prefixCls}-calendar-footer`} size="small" text onClick={selectToday}>
        {t('react_ui.date.today')}
      </Button>
    </div>
  )

  return (
    <Popover
      trigger="click"
      placement="bottom-start"
      disabled={disabled}
      content={calendar}
      open={open}
      onOpenChange={open => {
        setOpen(open)
        if (open) {
          setCurrentMonth(dayjs())
        }
      }}
    >
      <Button
        className={cls(className, prefixCls, `${prefixCls}-${size}`)}
        ref={ref}
        disabled={disabled}
        suffixIcon={
          allowClear && hasSelection && isHover ? (
            <IoMdCloseCircle
              className={`${prefixCls}-clear-icon`}
              onClick={event => {
                event.stopPropagation()
                setDateSelection(dayjs(null))
              }}
            />
          ) : (
            icon
          )
        }
        onMouseEnter={event => {
          onMouseEnter?.(event)
          startHover()
        }}
        onMouseLeave={event => {
          onMouseLeave?.(event)
          stopHover()
        }}
        {...rest}
      >
        {hasSelection ? dateSelection.format('YYYY/MM/DD') : placeholder}
      </Button>
    </Popover>
  )
}
_DatePicker.displayName = 'DatePicker'
export const DatePicker = forwardRef(_DatePicker)
