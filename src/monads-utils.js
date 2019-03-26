//#region Imports
const Maybe = require('folktale/maybe')
const Result = require('folktale/result')
const Future = require('folktale/concurrency/future')
import Promise from 'bluebird'
import R from 'ramda'
//#endregion

export const log = R.tap(console.log)
export const logF = R.map(R.tap(console.log))

// Convert a err/val callback into a Promise, then into a Future.
export const futureFromCallback = (...fun_argOpt) => mainArg =>
    Future.fromPromise(Promise.promisify(R.head(fun_argOpt))(mainArg, ...R.tail(fun_argOpt)))

// Convert a failable expression into a Maybe, then into a Result, then into a Future.
export const futureFromMaybe = failureLabel => fun => val =>
    Result.fromMaybe(Maybe.fromNullable(fun(val)), failureLabel).fold(Future.rejected, Future.of)
