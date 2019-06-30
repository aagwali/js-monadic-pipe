import { tap, pipe, always } from 'ramda'
import { Future, FutureInstance } from 'fluture'
import ora from 'ora'
import { Maybe } from 'monet'
import { AppError, AppFailure } from '../generics/errors'

export const log = tap(console.log)
export const logx = (x: any) => (y: any) => {
  log(x)
  return y
}

export const futurSpinnerWrapper = (
  [beginMsg, successMsg]: string[],
  fun: FutureInstance<any, any>
): FutureInstance<any, any> =>
  Future.of(log(beginMsg + '\n'))
    .map(always(ora('Processing...').start()))
    .chain(oraInst =>
      fun.bimap(
        pipe(tap(_ => oraInst.stop())),
        pipe(
          tap(_ => oraInst.stop()),
          logx(successMsg + '\n')
        )
      )
    )

export const truthyOrRej = <T>(fun: (x: T) => any, failure: AppFailure) => (
  payload: T
): FutureInstance<AppError, T> =>
  Maybe.fromFalsy(fun(payload)).cata(
    () =>
      Future.reject({
        name: 'Unallowed state',
        message: 'A guard close triggered a failure',
        failure
      }),
    () => Future.resolve(payload)
  )
