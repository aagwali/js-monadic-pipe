import {
  map,
  replace,
  applySpec,
  always,
  identity as id,
  split,
  join,
  init,
  not,
  isEmpty,
  equals,
  head,
  prop,
  all
} from 'ramda'
import { ErrorLocation as at, AppError } from './errors'
import { postHttp } from './http'
import {
  futureFromPromise as futurP,
  FutureInstance,
  formatError as throwErr,
  futureOfValue as futurV,
  log
} from 'ts-functors'

import { List } from 'monet'
const ListArr = List.fromArray

//#region Types
export type MsBatches = List<Batch>

export enum TaskStatus {
  Created = 'created',
  Processing = 'processing',
  Failed = 'failed',

  Ended = 'ended'
}
import { mockFileExporter } from './mocks'

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
//#endregion

export const adjustInput = map(replace('_', '-'))

export const buildPayload = (directories: string[]): SearchPayload => {
  return {
    limit: 0,
    keys: adjustInput(directories)
  }
}

export const isMediashare = (b: Batch): boolean =>
  equals('mediashare-exporter', head(split('_', prop('scopelock', b))))

export const areTasksEnded = (b: Batch): boolean =>
  all(isEnded, prop('tasks', b))

export const isEnded = (t: Task): boolean =>
  equals(TaskStatus.Ended, prop('status', t))

export const extractFolderName = (b: Batch): string =>
  join('/', init(split('/', prop('sourceURI', head(prop('tasks', b))))))

export const endedTasksFilePathes = (msBatches: List<Batch>): List<string> =>
  msBatches
    .map(prop('tasks'))
    .map(ListArr)
    .flatten()
    .filter(isEnded)
    .map((t: Task) => prop('sourceURI', t))

export const completeBatchDirectoryPathes = (
  batches: List<Batch>
): List<string> =>
  batches
    .filter((b: Batch) => not(isEmpty(prop('tasks', b))))
    .filter(areTasksEnded)
    .map(extractFolderName)

export const getBatches = (fileExporterUri: string) => (
  payload: SearchPayload
): FutureInstance<AppError, MsBatches> =>
  futurV(mockFileExporter)
    .map(ListArr)
    .map((lb: List<Batch>) => lb.filter(isMediashare))
    .bimap(
      throwErr(at.GetBatches),
      (output: MsBatches) => id(output) // no id plz
    )
