import { AppError, AppFailure as at, formatError, joiError } from './errors'
import { node, FutureInstance } from 'fluture'
import Joi from 'joi'

//#region Types
export type Seq = {
  [key: string]: any
}

export type Config = {
  pcmUri: string
  mongoDbUri: string
  spotUri: string
  collectionName: string
}
//#endregion

export const returnConfig = (env: Seq): Config => {
  return {
    pcmUri: env.PCM_URI,
    mongoDbUri: env.MONGO_DB_URI,
    spotUri: env.SPOT_URI,
    collectionName: env.COLLECTION_NAME
  }
}

const envSchema = Joi.object()
  .keys({
    PCM_URI: Joi.string().required(),
    MONGO_DB_URI: Joi.string().required(),
    SPOT_URI: Joi.string().required(),
    COLLECTION_NAME: Joi.string().required()
  })
  .unknown()

export const parseConfig = (env: Seq): FutureInstance<AppError, Config> =>
  node(cb => Joi.validate(env, envSchema, cb)).bimap(
    formatError(joiError, at.ParseConfig),
    returnConfig
  )
