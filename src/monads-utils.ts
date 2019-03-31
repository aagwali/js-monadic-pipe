//#region Imports
import { Maybe, Either } from 'monet'
import { Future } from 'fluture'
import R from 'ramda'
//#endregion

export const log = R.tap(console.log)
export const logF = R.map(R.tap(console.log))

export const futureFromMaybe = failureMsg => fun => val =>
    Maybe.fromUndefined(fun(val)).fold(Future.reject(failureMsg))(Future.of)

// export const futureFromCallback = (...fun_argOpt) => val =>
//     Future.node(done => R.head(fun_argOpt)(val, ...R.tail(fun_argOpt), done))
