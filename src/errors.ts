import { FuturError } from 'ts-functors'

export enum ErrorType {
  NODEBACK = 'Nodeback',
  PROMISE = 'Promise',
  DATA_PARSING = 'DataParsing',
  UNKNOWN = '⚠ unregistered error ⚠'
}

export enum ErrorLocation {
  VALIDATE_ENV_KEY = 'validateEnvKeys',
  TRY_UPSERT_BULL_MSG = 'tryUpsertBullMsg',
  BrowseMsSupplierFolder = 'browseMsSupplierFolder',
  GetBatches = 'GetBatches',
  UNLINK_FILES = 'unlink',
  REMOVE_DIRECTORY = 'rmdir',
  UNKNOWN = '⚠ unregistered error ⚠'
}

export type AppError2 = FuturError<ErrorLocation>

export enum ErrorMessages {
  VALIDATION_FAILURE = 'Validation failed for some keys :',
  UNKNOWN = '⚠ unregistered error ⚠'
}

export class AppError {
  type: ErrorType
  location: string
  error: Error
  constructor(location: ErrorLocation, error: Error, type: ErrorType) {
    this.type = type
    this.location = location
    this.error = error
  }
}

export const buildError = (loc: ErrorLocation, error: any): AppError => {
  const appError = new AppError(loc, error, undefined)
  switch (loc) {
    case ErrorLocation.VALIDATE_ENV_KEY:
      appError.type = ErrorType.DATA_PARSING
      appError.error = new Error(
        `${ErrorMessages.VALIDATION_FAILURE} "${appError.error}"`
      )
      break
    case ErrorLocation.TRY_UPSERT_BULL_MSG:
    case ErrorLocation.GetBatches:
    case ErrorLocation.UNLINK_FILES:
    case ErrorLocation.REMOVE_DIRECTORY:
      appError.type = ErrorType.PROMISE
      appError.error = error
      break
    case ErrorLocation.BrowseMsSupplierFolder:
      appError.type = ErrorType.NODEBACK
      appError.error = error
      break
    default:
      appError.type = ErrorType.UNKNOWN
      appError.error = error
      break
  }
  return appError
}
