import { Tracker } from '@youknown/utils/src'

interface ReportParams {
  event: string
  payload?: Record<string, any>
  [key: string]: any
}

const tracker = new Tracker({
  url: '/proxy/common/report'
})

export function report<T extends ReportParams>(params: T) {
  tracker.track(params)
}

export function reportInstant<T extends ReportParams>(params: T) {
  tracker.track(params, true)
}
