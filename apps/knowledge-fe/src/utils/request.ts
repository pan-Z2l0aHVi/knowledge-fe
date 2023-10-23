import { B_CODE } from '@/consts'
import { useUserStore } from '@/stores'
import { get_local_token } from '@/utils/local'
import { Toast } from '@youknown/react-ui/src'
import { headers2Obj, Net } from '@youknown/utils/src'

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
})
	.use(async (ctx, next) => {
		const token = get_local_token()
		if (token) {
			const headers = new Headers(ctx.req.configure.headers)
			headers.append('Authorization', token)
			ctx.req.configure.headers = headers2Obj(headers)
		}
		await next()
	})
	.use(async (ctx, next) => {
		const silent: boolean = ctx.req.configure?.silent ?? false

		await next()

		if (ctx.err) {
			Toast.error({ content: '无法连接到服务器，请检查网络连接' })
			return
		}
		switch (ctx.data?.code) {
			case B_CODE.SUCCESS:
				ctx.data = ctx.data.data
				break

			case B_CODE.NOT_AUTH:
				ctx.err = new NetFetchError(ctx.data)
				useUserStore.getState().do_logout()
				break

			default:
				ctx.err = new NetFetchError(ctx.data)
				if (!silent && ctx.data.msg) {
					Toast.error({
						content: ctx.data.msg
					})
				}
				break
		}
	})
