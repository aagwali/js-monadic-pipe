//#region
import { chain, map, pipe, tap } from 'ramda'
const { parseContent, fsAccess } = require('./example')
const log = tap(console.log)
const logF = map(tap(console.log))
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
