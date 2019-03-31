//#region
import { pipe, map } from 'ramda'
import { chain } from 'sanctuary'
import { log, logF } from './monads-utils'
import { test2, test1 } from './steps'
//#endregion

const input = { content: 'valid mock folder name' }

export const start = env => pipe(
    test1,
)(input).fork(log, x => console.log('ok success', x))
