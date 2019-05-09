import { Maybe, Validation } from 'monet'
import { tap } from 'ramda'

export const log = tap(console.log)

export const tryValidate = (val: any) => (fun: any) => (
  match: any
): Validation<any, any> =>
  Maybe.fromUndefined(fun(match, val)).toValidation([match])
