
export type FileSystemResult = string[]

export type FilePath = string

export type ReadFileResult = string

export type InitialPayload = string

export type InitialInput = {
  content: InitialPayload;
};

export class AppSuccess {
  result: ReadFileResult
  constructor(success: ReadFileResult) {
    this.result = success;
  }
}


// ERROR TYPES

export enum ErrorType {
  NODEBACK = "Nodeback",
  DATA_PARSING = "DataParsing",
  UNKNOWN = "⚠ unregistered error ⚠"
}

export enum ErrorLocations {
  TRY_FIND_PATH = "tryFindPath",
  READDIR = "readdir",
  TRY_FIND_IN_ARRAY = "tryFindInArray",
  TRY_READ_LINE = "tryReadLine",
  UNKNOWN = "⚠ unregistered error ⚠",
}

export enum ErrorMessages {
  PARSE_ROUTE_FAILURE = "Unable to parse route",
  FIND_ENTRY_FAILURE = "Unable to find entry",
  UNKNOWN = "⚠ unregistered error ⚠"
}

export class AppError {
  type: ErrorType;
  location: string
  details: {} | string;
  shouldFail: boolean
  fallback: any
  constructor(location: ErrorLocations, details: {} | string) {
    this.type = undefined;
    this.location = location;
    this.details = details;
    this.shouldFail = true;
    this.fallback = undefined;
  }
}

export const getErrorLocation = (nodeBackfunName: string
): ErrorLocations => {
  switch (nodeBackfunName) {
    case "readdir": return ErrorLocations.READDIR
    default: ErrorLocations.UNKNOWN
  }
}

export const buildError = (loc: ErrorLocations, details: any
): AppError => {
  const appError = new AppError(loc, details)
  switch (loc) {
    case (ErrorLocations.TRY_FIND_PATH):
      appError.type = ErrorType.DATA_PARSING
      appError.details = ` ⵁ  - ${ErrorMessages.PARSE_ROUTE_FAILURE} "${appError.details}"`
      break;
    case (ErrorLocations.TRY_FIND_IN_ARRAY):
      appError.type = ErrorType.DATA_PARSING
      appError.details = ` ⵁ  - ${ErrorMessages.FIND_ENTRY_FAILURE} "${appError.details}"`
      break;
    case (ErrorLocations.TRY_READ_LINE):
      appError.type = ErrorType.DATA_PARSING
      appError.details = ` ⵁ  - ${ErrorMessages.FIND_ENTRY_FAILURE} "${appError.details}"`
      break;
    case (ErrorLocations.READDIR):
      appError.type = ErrorType.NODEBACK
      appError.details = ` ⧖ ➝ ⨯  "${appError.details}"`
      break;
    default:
      appError.type = ErrorType.UNKNOWN
      appError.details = ErrorMessages.UNKNOWN
      break;
  }
  return appError
}

