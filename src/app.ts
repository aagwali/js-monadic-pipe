import { parseConfig } from './modules/generics/config'
import * as Pcm from './modules/business/pcm'
import { log } from './modules/generics/utlis'
import { opList } from './operationList'

export const main = () =>
  parseConfig(process.env)
    .chain(Pcm.launchIndex(opList))
    .fork(log, log)
