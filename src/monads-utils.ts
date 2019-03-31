import { Maybe, Either } from 'monet'
import { Future, node } from 'fluture'
import R from 'ramda'

export const log = R.tap(console.log)
export const logF = R.map(R.tap(console.log))

export const futureFromMaybe = failureMsg => fun => val =>
    Maybe.fromUndefined(fun(val)).fold(Future.reject(failureMsg))(Future.of)

export const futureFromNodeback = (...fun_argOpt) => val =>
    node(done => R.head(fun_argOpt)(val, ...R.tail(fun_argOpt), done))
