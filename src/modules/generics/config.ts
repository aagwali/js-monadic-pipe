import { AppError, AppFailure as at, formatError, joiError } from './errors'
import { node, FutureInstance } from 'fluture'
import Joi from 'joi'

export type Seq = {
  [key: string]: any
}

export type Config = {
  variable: string
}

export const returnConfig = (env: Seq): Config => {
  return {
    variable: env.VARIABLE
  }
}

const envSchema = Joi.object()
  .keys({
    VARIABLE: Joi.string().required()
  })
  .unknown()

export const parseConfig = (env: Seq): FutureInstance<AppError, Config> =>
  node(cb => Joi.validate(env, envSchema, cb)).bimap(
    formatError(joiError, at.ParseConfig),
    returnConfig
  )
