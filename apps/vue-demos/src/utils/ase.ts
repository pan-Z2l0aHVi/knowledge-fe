import CryptoJS from 'crypto-js'

// 设置密钥和初始化向量
const key = 'KaJmEoLpInQsTrVy'
const iv = CryptoJS.enc.Utf8.parse('XfIgHjEkDlMnBoUp')

export function encrypt(msg: string) {
  const encrypted = CryptoJS.AES.encrypt(msg, key, { iv })
  return encrypted.toString()
}

export function decrypt(ciphertext: string) {
  const decrypted = CryptoJS.AES.decrypt(ciphertext, key, { iv })
  return decrypted.toString(CryptoJS.enc.Utf8)
}
