import {
  AppError,
  AppFailure as fail,
  formatError,
  parseJoiValidationError
} from './errors'
import { node, FutureInstance } from 'fluture'
import Joi from 'joi'

//#region Types
export interface Seq {
  [key: string]: any
}

export type Config = {
  pcmUri: string
  mongoDbUri: string
}
//#endregion

export const mapConfig = (env: Seq): Config => {
  return {
    pcmUri: env.PCM_URI,
    mongoDbUri: env.MONGO_DB_URI
  }
}

const envSchema = Joi.object()
  .keys({
    PCM_URI: Joi.string().required(),
    MONGO_DB_URI: Joi.string().required()
  })
  .unknown()

export const parseConfig = (env: Seq): FutureInstance<AppError, Config> =>
  node(cb => Joi.validate(env, envSchema, cb))
    .mapRej(parseJoiValidationError)
    .bimap(formatError(fail.ParseConfig), mapConfig)
