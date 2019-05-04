import { AppError } from './errors'

// BUSINESS TYPES

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

type DeletionAccumulator = { success: string[]; failure: string[] }

export class DeletionResults {
  fileDeletion: DeletionAccumulator
  folderDeletion: DeletionAccumulator
  constructor(
    fileDeletion: DeletionAccumulator = { success: [], failure: [] },
    folderDeletion: DeletionAccumulator = { success: [], failure: [] }
  ) {
    this.fileDeletion = fileDeletion
    this.folderDeletion = folderDeletion
  }
}

// CONFIG TYPES

// Add each dotEnv key here to link all app
export type Config = {
  fileName: string
  fileName_fallback: string
  requiredProp: string
  fileLine: string
  bullQueueName: string
  bullRedisUrl: string
  jobFrequency: string
  supplierPath: string
  fileExporterUri: string
  maxSimultaneousTask: string
}

export const configEnvMapping: Config = {
  requiredProp: 'REQUIRED_PROP',
  fileName: 'FILE_NAME',
  fileName_fallback: 'FILE_NAME_FALLBACK',
  fileLine: 'FILE_LINE',
  bullQueueName: 'BULL_QUEUE_NAME',
  bullRedisUrl: 'BULL_REDIS_URL',
  jobFrequency: 'JOB_FREQUENCY',
  supplierPath: 'SUPPLIER_PATH',
  fileExporterUri: 'FILE_EXPORTER_URI',
  maxSimultaneousTask: 'MAX_SIMULTANEOUS_TASKS'
}

// builder
export const buildConfig = (env: any): Config => {
  return {
    fileName: env.FILE_NAME,
    fileName_fallback: env.FILE_NAME_FALLBACK,
    requiredProp: env.REQUIRED_PROP,
    fileLine: env.FILE_LINE,
    bullQueueName: env.BULL_QUEUE_NAME,
    bullRedisUrl: env.BULL_REDIS_URL,
    jobFrequency: env.JOB_FREQUENCY,
    supplierPath: env.SUPPLIER_PATH,
    fileExporterUri: env.FILE_EXPORTER_URI,
    maxSimultaneousTask: env.MAX_SIMULTANEOUS_TASKS
  }
}

// HELPERS TYPES

export type JSONResponse<J> = {
  json: () => Promise<J>
  statusText: string
  status: string
}
