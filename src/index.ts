//#region
import { chain, pipe, map, identity } from 'ramda'
import { log, logF } from './monads-utils'
import { tryPath, readFs } from './steps'
//#endregion

const input = { content: 'valid mock folder name' }

const test = pipe(
    tryPath(['content']),
    chain(readFs)
)(input).fork(log, log)
