/// <reference types="vite/client" />

import 'mdx'

interface ImportMetaEnv {
  readonly VITE_ROUTER_BASENAME: string
  readonly VITE_LOCAL_PROXY_BASE_URL: string
  readonly VITE_CDN_BASE_URL: string
  readonly VITE_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
