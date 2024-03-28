import type { Middleware, Next } from '../compose'
import { asyncCompose } from '../compose'
import { headers2Obj } from '../data'
import { pick } from '../object'
import QS from '../qs'
import { delay } from '../time'

export interface Configure extends RequestInit {
  baseURL?: string
  params?: Record<string, any>
  payload?: any
  timeout?: number
  responseType?: 'json' | 'text' | 'blob' | 'formData' | 'arrayBuffer'
  [key: string]: any
}
export interface Request {
  url: string
  configure: Configure
}
export interface Context {
  req: Request
  res: Response
  data: any
  err: any
}

export class Net {
  private baseConf: Partial<Configure>
  private middlewares: Middleware<Context>[]

  private static DEFAULT_HEADERS: Configure['headers'] = {
    'Content-Type': 'application/json'
  }

  public static create(baseConf: Partial<Configure> = {}): Net {
    const inst = new Net()
    const mergedHeaders = {
      ...Net.DEFAULT_HEADERS,
      ...baseConf.headers
    }
    inst.baseConf = {
      baseURL: '',
      mode: 'cors',
      credentials: 'omit',
      ...baseConf,
      headers: mergedHeaders
    }
    return inst
  }

  constructor() {
    this.baseConf = {}
    this.middlewares = []
  }

  private get fullMiddleware() {
    return asyncCompose([
      ...this.middlewares,
      this.formatPayload.bind(this),
      this.errorMiddleware.bind(this),
      this.fetchMiddleware.bind(this)
    ])
  }

  private async formatPayload(ctx: Context, next: Next): Promise<void> {
    const { payload } = ctx.req.configure
    if (payload instanceof FormData) {
      const headers = new Headers(ctx.req.configure.headers)
      headers.delete('Content-Type')
      ctx.req.configure.headers = headers2Obj(headers)
    } else {
      ctx.req.configure.payload = JSON.stringify(ctx.req.configure.payload)
    }
    await next()
  }

  private async errorMiddleware(ctx: Context, next: Next): Promise<void> {
    try {
      await next()
    } catch (error) {
      ctx.err = error
    }
  }

  private async fetchMiddleware(ctx: Context): Promise<void> {
    const { responseType = 'json' } = ctx.req.configure
    if (ctx.req.configure.timeout) {
      const res = await Promise.race([this.request(ctx), delay(ctx.req.configure.timeout)])
      if (res instanceof Response) {
        ctx.res = res
        ctx.data = await res[responseType]()
      } else {
        throw new Error('request timeout')
      }
    } else {
      const res = await this.request(ctx)
      ctx.res = res
      ctx.data = await res[responseType]()
    }
  }

  private request(ctx: Context): Promise<Response> {
    const reqInfo = QS.stringify({
      base: `${ctx.req.configure.baseURL}${ctx.req.url}`,
      query: ctx.req.configure.params ?? {}
    })
    const reqInit = pick(
      {
        ...ctx.req.configure,
        body: ctx.req.configure.payload
      },
      'headers',
      'method',
      'mode',
      'body',
      'cache',
      'credentials',
      'redirect',
      'referrerPolicy'
    )
    return fetch(reqInfo, reqInit)
  }

  public use(middleware: Middleware<Context>): this {
    this.middlewares.push(middleware)
    return this
  }

  public async fetch<R = any>(url: string, conf: Configure = {}): Promise<R> {
    const ctx: Context = {
      req: {
        url,
        configure: {
          ...this.baseConf,
          ...conf
        }
      },
      res: new Response(),
      data: null,
      err: null
    }
    await this.fullMiddleware(ctx)
    if (ctx.err) {
      return Promise.reject(ctx.err)
    }
    return ctx.data as R
  }
}

// // middleware
// const net = Net.create({
// 	headers: {
// 		'custom-header': '123123'
// 	}
// })
// ;(window as any).net = net

// net.use(async (ctx, next) => {
// 	console.log('a1', ctx)
// 	await next()
// 	console.log('a2', ctx)
// }).use(async (ctx, next) => {
// 	console.log('b1', ctx)
// 	await next()
// 	console.log('b2', ctx)
// })

/*===================== Basic =====================*/
// net.fetch('fetch_test.json', {
// 	params: {
// 		a: '111',
// 		b: 222
// 	}
// })
// 	.then(res => {
// 		console.log('res: ', res)
// 	})
// 	.catch(err => {
// 		console.error('fetch error', err)
// 	})

/*===================== Abort =====================*/
// const abortController = new AbortController()
// net.fetch('fetch_test.json', {
// 	signal: abortController.signal,
// 	params: {
// 		a: '111',
// 		b: 222
// 	}
// })
// 	.then(res => {
// 		console.log('res: ', res)
// 	})
// 	.catch(err => {
// 		console.error('fetch error', err)
// 	})
// abortController.abort()

/*===================== Timeout =====================*/
// net.fetch('fetch_test.json', {
// 	params: {
// 		a: '111',
// 		b: 222
// 	},
// 	timeout: 1
// })
// 	.then(res => {
// 		console.log('res: ', res)
// 	})
// 	.catch(err => {
// 		console.error('fetch error', err)
// 	})

/*===================== FormData =====================*/
// const formData = new FormData()
// formData.append('x', 'test')
// formData.append('y', new Blob())
// net.fetch('fetch_test.json', {
// 	method: 'post',
// 	payload: formData
// })
// 	.then(res => {
// 		console.log('res: ', res)
// 	})
// 	.catch(err => {
// 		console.error('fetch error', err)
// 	})
