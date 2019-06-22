import {
  AppError,
  AppFailure as fail,
  formatError,
  parseValidationError
} from './errors'
import { node as futurN, FutureInstance } from 'fluture'
import Joi from 'joi'

export interface Seq {
  [key: string]: any
}

// Add each dotEnv key here to link all application
export type Config = {
  bullQueueName: string
  bullRedisUrl: string
}

export const mapEnvKeys = (env: Seq): Config => {
  return {
    bullQueueName: env.BULL_QUEUE_NAME,
    bullRedisUrl: env.BULL_REDIS_URL
  }
}

const envSchema = Joi.object()
  .keys({
    BULL_QUEUE_NAME: Joi.string().required(),
    BULL_REDIS_URL: Joi.string().required()
  })
  .unknown()

export const buildConfig = (env: Seq): FutureInstance<AppError, Config> =>
  futurN(cb => Joi.validate(env, envSchema, cb))
    .mapRej(parseValidationError)
    .bimap(formatError(fail.BuildConfig), mapEnvKeys)
