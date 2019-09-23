import { parseConfig } from './modules/generics/config'
import * as MyModule from './modules/business/moduleName'
import { log } from './modules/generics/utlis'

// todo add all signatures

export const main = () =>
  parseConfig(process.env)
    .map(MyModule.doSomethingSync)
    .chain(MyModule.doSomethingAsync)
    .fork(log, log)
