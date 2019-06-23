import { tap, pipe, always } from 'ramda'
import { Future, FutureInstance } from 'fluture'
import ora from 'ora'
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
