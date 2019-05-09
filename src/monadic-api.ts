/* ٭ ★ This is a clEAN WAy to ride A pipe ★ ٭ */
import { Maybe, Either, Validation } from 'monet'
import { Future, node, FutureInstance, Nodeback, encaseP, tryP } from 'fluture'
import R from 'ramda'
import { AppError, ErrorLocation, buildError } from './errors'

export const resolveDefault = <T>(defaultVal: T) =>
  R.always(Future.of(defaultVal))

export const validationFromMaybe = (val: any) => (fun: any) => (
  match: any
): Validation<any, any> =>
  Maybe.fromUndefined(fun(match, val)).toValidation([match])

export const futureFromMaybe = (errAt: ErrorLocation, details: any) => (
  fun: any
) => (arg: any): FutureInstance<AppError, any> =>
  Maybe.fromUndefined(fun(arg)).fold(Future.reject(buildError(errAt, details)))(
    Future.of
  )

export const futureFromNodeback = (errAt: ErrorLocation) => (
  fun: Nodeback<any, any>
) => (mainArg: any) => (optArgs: any[]): FutureInstance<AppError, any> =>
  node(done => fun(mainArg, ...optArgs, done)).mapRej(err =>
    buildError(errAt, err)
  )

export const futureFromPromise = (errAt: ErrorLocation) => (
  fun: (a: any) => Promise<any>
) => (mainArg: any): FutureInstance<AppError, any> =>
  encaseP(fun, mainArg).mapRej(err => buildError(errAt, err))
