import { prop, head } from 'ramda'
import { ValidationError as JoiValidationError } from 'joi'
import { MongoError } from 'mongodb'
import { List } from 'monet'

export enum AppFailure { // why must stop, failure reason ?
  ParseSettings = 'Application failed to build job settings from command args',
  ParseConfig = 'Unable to build configuration from dotEnv',
  ConnectMongo = 'Unable to connect mongo database',
  GetSpotOpInfos = 'Unable to get operation infos from spot API',
  CheckOpenDate = 'Spot operation is not closed yet',
  GetDetPath = 'Unable to get NAS operation path from spot API'
}

export type AppError = {
  failure?: AppFailure
  name: string
  message: string
}

export const mapAppError = (name: string, message: string): AppError => {
  return {
    name,
    message
  }
}

export const joiError = (error: JoiValidationError): AppError =>
  List.fromArray(prop('details', error))
    .map(({ type, message }) => mapAppError(type, message))
    .head()

export const mongoError = ({ name, message }: MongoError) =>
  mapAppError(name, message)

export const formatError = <T>(
  parser: (x: T) => AppError,
  failure: AppFailure
) => (error: T): AppError => {
  return {
    ...parser(error),
    failure
  }
}
