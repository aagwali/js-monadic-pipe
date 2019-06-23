import { prop } from 'ramda'
import { ValidationError as JoiValidationError } from 'joi'
import { MongoParseError } from 'mongodb'

export enum AppFailure {
  BuildSettings = 'Application failed to build job settings from command args',
  BuildConfig = 'Application failed to build configuration from dotEnv',
  ConnectMongo = 'Application failed to connect to mongo database'
}

export type AppError = {
  applicationFailure: AppFailure
  details: string
}

export const parseJoiValidationError = (err: JoiValidationError) =>
  prop('details', err).map(prop('message'))

export const parseMongoParseError = (x: MongoParseError) => prop('message', x)

export const formatError = (errLocation: AppFailure) => (
  error: any
): AppError => {
  return {
    applicationFailure: errLocation,
    details: error
  }
}
