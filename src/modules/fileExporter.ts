import {
  replace,
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
import { mockFileExporter } from './mocks'
import { ErrorLocation as at, Application as AppError } from './errors'
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

//#region Models

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

export type MsBatches = List<Batch>

//#endregion

//#region Predicates

export const isEnded = (t: Task): boolean =>
  equals(TaskStatus.Ended, prop('status', t))

export const areTasksEnded = (b: Batch): boolean =>
  all(isEnded, prop('tasks', b))

export const isMediashare = (b: Batch): boolean =>
  equals('mediashare-exporter', head(split('_', prop('scopelock', b))))

//#endregion

//#region Operations

export const extractDirectoryPathes = (b: Batch): string =>
  join('/', init(split('/', prop('sourceURI', head(prop('tasks', b))))))

export const completeBatchDirectoryPathes = (
  batches: List<Batch>
): List<string> =>
  batches
    .filter((b: Batch) => not(isEmpty(prop('tasks', b))))
    .filter(areTasksEnded)
    .map(extractDirectoryPathes)

export const endedTasksFilePathes = (batches: List<Batch>): List<string> =>
  batches
    .map(prop('tasks'))
    .map(ListArr)
    .flatten()
    .filter(isEnded)
    .map((t: Task) => prop('sourceURI', t))

//#endregion

//#region Conversions

export const buildPayload = (directories: string[]): SearchPayload => {
  return {
    limit: 0,
    keys: directories.map(replace('_', '-'))
  }
}

export const getBatches = (fileExporterUri: string) => (
  payload: SearchPayload
): FutureInstance<AppError, MsBatches> =>
  futurV(mockFileExporter)
    .map(ListArr)
    .bimap(
      throwErr(at.GetBatches),
      (lb: List<Batch>) => lb.filter(isMediashare) // no id plz
    )

//#endregion
