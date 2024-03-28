import { Net } from '@youknown/utils/src'

export const net = Net.create().use(async (ctx, next) => {
  await next()
  console.log('net ctx', ctx)
  if (!ctx.err) {
    if ([0, 200].includes(ctx.data?.code)) {
      ctx.data = ctx.data.data
    } else {
      ctx.err = ctx.data
    }
  }
})
