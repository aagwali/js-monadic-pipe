import { prop, head } from 'ramda'
import { ValidationError as JoiValidationError } from 'joi'
import { MongoError } from 'mongodb'
import { List } from 'monet'

export enum AppFailure { // why must stop, failure reason ?
  ParseConfig = 'Unable to build configuration from dotEnv',
  ConnectMongo = 'Unable to connect mongo database'
}

export type AppError = {
  failure?: AppFailure
  name: string
  message: string
}

interface StandardError {
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

export const standardError = ({ name, message }: StandardError) =>
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
