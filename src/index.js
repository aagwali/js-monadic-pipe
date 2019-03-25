//#region
import { chain, pipe } from 'ramda'
import * as Monad from './monads-utils'
import { parseContent, fsAccess } from './steps'
//#endregion

const msg = {
  type: 'LABEL_WICH_TRIGGER_TASK',
  content: 'anythingUseful'
}

pipe(
  parseContent,
  chain(fsAccess)
)(msg).listen({
  onRejected: error => console.error({ error }),
  onResolved: success => console.log({ success })
})
