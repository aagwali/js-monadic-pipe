import { Application as AppError, ErrorLocation as at } from './errors'
import { ListArr, validationFromUndefined as ValidUnd } from './utils'
import { prop, values } from 'ramda'
import {
  formatError as throwFuturErr,
  FutureInstance as Future,
  futureOfValue as futurV,
  futureRejectOfValue as futurRejV,
  log
} from 'ts-functors'
export interface Env {
  [key: string]: string
}

// Add each dotEnv key here to link all application
export type Config = {
  bullQueueName: string
  bullRedisUrl: string
  jobFrequency: string
  rawshootPath: string
  fileExporterUri: string
  maxSimultaneousTasks: string
}

export const mapping: Config = {
  bullQueueName: 'BULL_QUEUE_NAME',
  bullRedisUrl: 'BULL_REDIS_URL',
  jobFrequency: 'JOB_FREQUENCY',
  rawshootPath: 'RAWSHOOT_PATH',
  fileExporterUri: 'FILE_EXPORTER_SEARCH_URI',
  maxSimultaneousTasks: 'MAX_SIMULTANEOUS_TASKS'
}

export const mapper = (env: Env): Config => {
  return {
    bullQueueName: env.BULL_QUEUE_NAME,
    bullRedisUrl: env.BULL_REDIS_URL,
    jobFrequency: env.JOB_FREQUENCY,
    rawshootPath: env.RAWSHOOT_PATH,
    fileExporterUri: env.FILE_EXPORTER_SEARCH_URI,
    maxSimultaneousTasks: env.MAX_SIMULTANEOUS_TASKS
  }
}

export const buildConfig = (
  mapping: Config,
  env: Env
): Future<AppError, Config> =>
  ListArr(values(mapping))
    .map(ValidUnd(prop, env))
    .sequenceValidation()
    .fold(futurRejV, futurV)
    .bimap((e: any) => throwFuturErr(at.TryBuildConfig)(e), () => mapper(env))
