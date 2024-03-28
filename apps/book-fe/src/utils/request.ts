import { Toast } from '@youknown/react-ui/src'
import type { ArgumentType } from '@youknown/utils/src'
import { Net } from '@youknown/utils/src'

import { B_CODE } from '@/consts'

const { t } = await import('i18next')

interface Cause {
  code: number
  data: any
  msg: string
}

export class NetFetchError extends Error {
  public cause: Cause
  constructor(cause: Cause) {
    super('Net fetch error', {
      cause
    })
    this.cause = cause
  }
}

export const net = Net.create({
  timeout: 10000
}).use(async (ctx, next) => {
  const silent: boolean = ctx.req.configure?.silent ?? false

  await next()

  if (ctx.err) {
    Toast.error(t('network.error'))
    return
  }
  switch (ctx.data?.code) {
    case B_CODE.SUCCESS:
      ctx.data = ctx.data.data
      break

    default:
      ctx.err = new NetFetchError(ctx.data)
      if (!silent && ctx.data.msg) {
        Toast.error(ctx.data.msg)
      }
      break
  }
})

type Fetcher = (...args: any[]) => Promise<any>
export const with_api =
  <T extends Fetcher>(fetcher: T) =>
  async (...args: ArgumentType<T>[]): Promise<[null, Awaited<ReturnType<T>>] | [NetFetchError, null]> => {
    try {
      const res: Awaited<ReturnType<T>> = await fetcher(...args)
      return [null, res]
    } catch (err) {
      return [err as NetFetchError, null]
    }
  }
