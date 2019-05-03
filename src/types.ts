export type InitialInput = {
  folder: string
}

export type Config = {
  fileName: string
  fileName_fallback: string
  requiredProp: string
  fileLine: string
  bullQueueName: string
  bullRedisUrl: string
  jobFrequency: string
}

export const configEnvMapping: Config = {
  requiredProp: 'REQUIRED_PROP',
  fileName: 'FILE_NAME',
  fileName_fallback: 'FILE_NAME_FALLBACK',
  fileLine: 'FILE_LINE',
  bullQueueName: 'BULL_QUEUE_NAME',
  bullRedisUrl: 'BULL_REDIS_URL',
  jobFrequency: 'JOB_FREQUENCY'
}

export const buildConfig = (env: any): Config => {
  return {
    fileName: env.FILE_NAME,
    fileName_fallback: env.FILE_NAME_FALLBACK,
    requiredProp: env.REQUIRED_PROP,
    fileLine: env.FILE_LINE,
    bullQueueName: env.BULL_QUEUE_NAME,
    bullRedisUrl: env.BULL_REDIS_URL,
    jobFrequency: env.JOB_FREQUENCY
  }
}

export class AppSuccess {
  result: string
  constructor(success: string) {
    this.result = success
  }
}
