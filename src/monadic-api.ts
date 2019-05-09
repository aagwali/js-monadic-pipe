/* ٭ ★ This is a clEAN WAy to ride A pipe ★ ٭ */
import { Maybe, Either, Validation } from 'monet'
import { Future, node, FutureInstance, Nodeback, encaseP, tryP } from 'fluture'
import R from 'ramda'
import { AppError, ErrorLocation } from './errors'

export const futureFromPromise = (errAt: ErrorLocation) => (
  fun: (a: any) => Promise<any>
) => (mainArg: any): FutureInstance<AppError, any> => encaseP(fun, mainArg)
