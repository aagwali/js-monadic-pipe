import { map, replace } from 'ramda'
import { AppError, ErrorLocations as errAt } from '../errors'
import { futureFromPromise as ifPromiseRejects } from '../monadic-api'
import { Batch } from '../types'
import { FutureInstance as AsyncEither } from 'fluture'
import { postHttp } from '../apiHelper'

export const getTaskList = (fileExporterUri: string) => (
  directoryContent: string[]
): AsyncEither<AppError, Batch[]> =>
  ifPromiseRejects(errAt.GET_TASK_LIST)(postHttp(fileExporterUri))({
    limit: 0,
    keys: map(replace('_', '-'), directoryContent)
  })
