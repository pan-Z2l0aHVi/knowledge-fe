const { t } = await import('i18next')

type Validator<T> = (value: T) => Promise<string | void>

export const validate_required = (): Validator<string> => async value => {
  if (value.trim() === '') {
    return Promise.reject(t('validate.required'))
  }
}

export const validate_arr_required = (): Validator<unknown[]> => async value => {
  if (!value.length) {
    return Promise.reject(t('validate.array_required'))
  }
}

export const validate_max_length =
  (max: number): Validator<string> =>
  async value => {
    if (value.length > max) {
      return Promise.reject(t('validate.max_len', { max }))
    }
  }

export const validate_alpha_numeric = (): Validator<string> => async (value: string) => {
  const regex = /^[A-Za-z0-9]+$/
  if (!regex.test(value)) {
    return Promise.reject(t('validate.letters_and_numbers'))
  }
}

export const validate_cn_phone_number = (): Validator<string> => async (value: string) => {
  const regex = /^[1][3-9]\d{9}$/
  if (!regex.test(value)) {
    return Promise.reject(t('validate.phone'))
  }
}
