import { Maybe, Validation } from 'monet'

export const validationFromUndefined = <T, U>(
  fun: (val: U, payld: T) => any | undefined | null,
  payload: T
) => (value: U): Validation<U[], any> =>
  Maybe.fromUndefined(fun(value, payload)).toValidation([value])

// (...args: any[]) => any

// .reduce((acc, validation) => validation.ap(acc.acc()))
