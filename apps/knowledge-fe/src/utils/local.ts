import { storage } from '@youknown/utils/src'

// AUTH TOKEN
const TOKEN_KEY = 'token'
export function set_local_token(token: string) {
  storage.local.set(TOKEN_KEY, token)
}

export function get_local_token() {
  return storage.local.get<string>(TOKEN_KEY)
}

export function remove_local_token() {
  return storage.local.remove(TOKEN_KEY)
}
