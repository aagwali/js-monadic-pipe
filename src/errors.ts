export enum ErrorType {
  NODEBACK = 'Nodeback',
  PROMISE = 'Promise',
  DATA_PARSING = 'DataParsing',
  UNKNOWN = '⚠ unregistered error ⚠'
}

export enum ErrorLocations {
  TRY_FIND_PATH = 'tryFindPath',
  READDIR = 'readdir',
  READ_FILE = 'readFile',
  TRY_FIND_IN_ARRAY = 'tryFindInArray',
  TRY_READ_LINE = 'tryReadLine',
  VALIDATE_ENV_KEY = 'validateEnvKeys',
  TRY_UPSERT_BULL_MSG = 'tryUpsertBullMsg',
  UNKNOWN = '⚠ unregistered error ⚠'
}

export enum ErrorMessages {
  PARSE_ROUTE_FAILURE = 'Unable to parse route',
  VALIDATION_FAILURE = 'Validation failed for some keys :',
  FIND_ENTRY_FAILURE = 'Unable to find entry',
  UNKNOWN = '⚠ unregistered error ⚠'
}

export class AppError {
  type: ErrorType
  location: string
  details: {} | string
  constructor(location: ErrorLocations, details: {} | string, type: ErrorType) {
    this.type = type
    this.location = location
    this.details = details
  }
}

export const buildError = (loc: ErrorLocations, details: any): AppError => {
  const appError = new AppError(loc, details, undefined)
  switch (loc) {
    case ErrorLocations.TRY_FIND_PATH:
      appError.type = ErrorType.DATA_PARSING
      appError.details = ` ⵁ  - ${ErrorMessages.PARSE_ROUTE_FAILURE} "${
        appError.details
      }"`
      break
    case ErrorLocations.TRY_FIND_IN_ARRAY:
      appError.type = ErrorType.DATA_PARSING
      appError.details = ` ⵁ  - ${ErrorMessages.FIND_ENTRY_FAILURE} "${
        appError.details
      }"`
      break
    case ErrorLocations.TRY_READ_LINE:
      appError.type = ErrorType.DATA_PARSING
      appError.details = ` ⵁ  - ${ErrorMessages.FIND_ENTRY_FAILURE} "${
        appError.details
      }"`
      break
    case ErrorLocations.READDIR:
    case ErrorLocations.READ_FILE:
      appError.type = ErrorType.NODEBACK
      appError.details = ` ⧖ ➝ ⨯  "${appError.details}"`
      break
    case ErrorLocations.VALIDATE_ENV_KEY:
      appError.type = ErrorType.DATA_PARSING
      appError.details = ` ⵁ  - ${ErrorMessages.VALIDATION_FAILURE} "${
        appError.details
      }"`
      break
    case ErrorLocations.TRY_UPSERT_BULL_MSG:
      appError.type = ErrorType.PROMISE
      appError.details = ` ⧖ ➝ ⨯  "${appError.details}"`
      break
    default:
      appError.type = ErrorType.UNKNOWN
      appError.details = ErrorMessages.UNKNOWN
      break
  }
  return appError
}
