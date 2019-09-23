import { log } from '../generics/utlis'
import { Config } from '../generics/config'
import { Future } from 'fluture'
import {
  AppError,
  formatError,
  AppFailure as at,
  standardError
} from '../generics/errors'

export const doSomethingSync = (conf: Config): string => {
  console.log(`Something has been done with "${conf.variable}"`)
  return 'result sync action'
}

export const doSomethingAsync = (previousResult: string) =>
  Future.of(
    console.log(`Something Async has been done with "${previousResult}"`)
  )
    .map(() => 'finalResult')
    // .chain(() => Future.reject({ name: 'error example', message: 'ifFails' }))
    .mapRej(formatError(standardError, at.ErrorLocation))
