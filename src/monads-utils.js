//#region Imports
const Future = require('folktale/concurrency/future')
import Promise from 'bluebird'
import R from 'ramda'
//#endregion

export const log = R.tap(console.log)
export const logF = R.map(R.tap(console.log))

export const futureFromCallback = (...fun_argOpt) => mainArg =>
  Future.fromPromise(
    Promise.promisify(R.head(fun_argOpt))(mainArg, ...R.tail(fun_argOpt))
  )
