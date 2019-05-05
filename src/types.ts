import R from 'ramda'
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

export class DeletionTask {
  filePathes: string[]
  folderPathes: string[]
  fileDeletionErrors: string[]
  folderDeletionErrors: string[]
  constructor(
    filePathes,
    folderPathes,
    fileDeletionErrors = [],
    folderDeletionErrors = []
  ) {
    this.filePathes = filePathes
    this.folderPathes = folderPathes
    this.fileDeletionErrors = fileDeletionErrors
    this.folderDeletionErrors = folderDeletionErrors
  }
}

// CONFIG TYPES

// Add each dotEnv key here to link all app
export type Config = {
  bullQueueName: string
  bullRedisUrl: string
  jobFrequency: string
  supplierPath: string
  fileExporterUri: string
  maxSimultaneousTasks: string
}

export const configEnvMapping: Config = {
  bullQueueName: 'BULL_QUEUE_NAME',
  bullRedisUrl: 'BULL_REDIS_URL',
  jobFrequency: 'JOB_FREQUENCY',
  supplierPath: 'SUPPLIER_PATH',
  fileExporterUri: 'FILE_EXPORTER_URI',
  maxSimultaneousTasks: 'MAX_SIMULTANEOUS_TASKS'
}

// builder
export const buildConfig = (env: any): Config => {
  return {
    bullQueueName: env.BULL_QUEUE_NAME,
    bullRedisUrl: env.BULL_REDIS_URL,
    jobFrequency: env.JOB_FREQUENCY,
    supplierPath: env.SUPPLIER_PATH,
    fileExporterUri: env.FILE_EXPORTER_URI,
    maxSimultaneousTasks: env.MAX_SIMULTANEOUS_TASKS
  }
}

// HELPERS TYPES

export type JSONResponse<J> = {
  json: () => Promise<J>
  statusText: string
  status: string
}
