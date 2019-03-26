//#region
import { chain, pipe } from 'ramda'
import * as M from './monads-utils'
import { tryParseContent, readUtilsFile } from './steps'
//#endregion

const msg = {
    type: 'LABEL_WICH_TRIGGER_TASK',
    content: 'anythingUseful',
}

pipe(
    tryParseContent,
    chain(readUtilsFile)
)(msg).listen({
    onRejected: error => console.error({ error }),
    onResolved: success => console.log({ success }),
})
