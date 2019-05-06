export enum ErrorType {
  NODEBACK = 'Nodeback',
  PROMISE = 'Promise',
  DATA_PARSING = 'DataParsing',
  UNKNOWN = '⚠ unregistered error ⚠'
}

export enum ErrorLocations {
  VALIDATE_ENV_KEY = 'validateEnvKeys',
  TRY_UPSERT_BULL_MSG = 'tryUpsertBullMsg',
  BROWSE_SUPPLIER_TEMP = 'browseMsSupplierFolder',
  GET_TASK_LIST = 'getTaskList',
  UNLINK_FILES = 'unlink',
  REMOVE_DIRECTORY = 'rmdir',
  UNKNOWN = '⚠ unregistered error ⚠'
}

export enum ErrorMessages {
  VALIDATION_FAILURE = 'Validation failed for some keys :',
  UNKNOWN = '⚠ unregistered error ⚠'
}

export class AppError {
  type: ErrorType
  location: string
  error: Error
  constructor(location: ErrorLocations, error: Error, type: ErrorType) {
    this.type = type
    this.location = location
    this.error = error
  }
}

export const buildError = (loc: ErrorLocations, error: any): AppError => {
  const appError = new AppError(loc, error, undefined)
  switch (loc) {
    case ErrorLocations.VALIDATE_ENV_KEY:
      appError.type = ErrorType.DATA_PARSING
      appError.error = new Error(
        `${ErrorMessages.VALIDATION_FAILURE} "${appError.error}"`
      )
      break
    case ErrorLocations.TRY_UPSERT_BULL_MSG:
    case ErrorLocations.GET_TASK_LIST:
    case ErrorLocations.UNLINK_FILES:
    case ErrorLocations.REMOVE_DIRECTORY:
      appError.type = ErrorType.PROMISE
      appError.error = error
      break
    case ErrorLocations.BROWSE_SUPPLIER_TEMP:
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
