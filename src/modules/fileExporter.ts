import { map, replace, applySpec, always, identity as id, prop } from 'ramda'
import { ErrorLocation as at, AppError } from './errors'
import { postHttp } from '../apiHelper'
import {
  futureFromPromise as futurP,
  FutureInstance,
  formatError,
  log
} from 'ts-functors'

export enum TaskStatus {
  Created = 'created',
  Processing = 'processing',
  Failed = 'failed',
  Ended = 'ended'
}

export type Task = {
  id: string
  sourceURI: string
  status: TaskStatus
}

export type Batch = {
  id: string
  scopelock: string
  correlationId: string
  tasks: Array<Task>
}

export type SearchPayload = {
  limit: number
  keys: string[]
}

export const adjustInput = map(replace('_', '-'))

export const buildPayload: (directories: string[]) => SearchPayload = applySpec(
  {
    limit: always(0),
    keys: adjustInput
  }
)

export const getBatches = (fileExporterUri: string) => (
  payload: SearchPayload
): FutureInstance<AppError, any> =>
  futurP(postHttp(fileExporterUri))(payload)
    .map(map(prop('tasks')))
    .bimap(log, log)
    .bimap(
      formatError(at.GetBatches),
      (output: Batch[]) => id(output) // immutable
    )
