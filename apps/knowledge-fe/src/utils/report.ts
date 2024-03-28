import { Tracker } from '@youknown/utils/src'

import { get_local_token } from './local'

interface ReportParams {
  event: string
  payload?: Record<string, any>
  [key: string]: unknown
}

const tracker = new Tracker({
  url: '/proxy/common/report',
  formatter(paramsList) {
    return {
      token: get_local_token(),
      data: paramsList
    }
  }
})

export function report<T extends ReportParams>(params: T) {
  tracker.track(params)
}

export function reportInstant<T extends ReportParams>(params: T) {
  tracker.track(params, true)
}
