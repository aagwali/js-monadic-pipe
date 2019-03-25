//#region Imports
import Maybe from 'folktale/maybe'
import Result from 'folktale/result'
import Future from 'folktale/concurrency/future'
import Promise from 'bluebird'
import R from 'ramda'
//#endregion

const log = R.tap(console.log)
const logF = R.map(R.tap(console.log))

const futureFromCallback = (...fun_argOpt) => mainArg =>
  Future.fromPromise(
    Promise.promisify(R.head(fun_argOpt))(mainArg, ...R.tail(fun_argOpt))
  )

module.exports = { Maybe, Result, Future, futureFromCallback, log, logF }
