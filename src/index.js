//#region
import { chain, pipe } from 'ramda'
import * as M from './monads-utils'
import { tryPath, readFs } from './steps'
//#endregion

const input = { content: 'valid mock folder name' }

pipe(
    tryPath(['content']),
    chain(readFs)
)(input).listen({
    onRejected: error => console.error({ error }),
    onResolved: success => console.log({ success }),
})
