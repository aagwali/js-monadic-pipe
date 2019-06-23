import {
  AppError,
  AppFailure as fail,
  formatError,
  parseJoiValidationError
} from './errors'
import { node, FutureInstance } from 'fluture'
import Joi from 'joi'

export interface Seq {
  [key: string]: any
}

export type Config = {
  bullQueueName: string
  mongoDbUri: string
}

export const mapEnvKeys = (env: Seq): Config => {
  return {
    bullQueueName: env.BULL_QUEUE_NAME,
    mongoDbUri: env.MONGO_DB_URI
  }
}

const envSchema = Joi.object()
  .keys({
    BULL_QUEUE_NAME: Joi.string().required(),
    MONGO_DB_URI: Joi.string().required()
  })
  .unknown()

export const buildConfig = (env: Seq): FutureInstance<AppError, Config> =>
  node(cb => Joi.validate(env, envSchema, cb))
    .mapRej(parseJoiValidationError)
    .bimap(formatError(fail.BuildConfig), mapEnvKeys)
