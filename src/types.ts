
export type FileSystemResult = string[]

export type FilePath = string

export type ReadFileResult = string

export type InitialPayload = string

export type InitialInput = {
  content: InitialPayload;
};

export type SHIT = FileSystemResult | FilePath





// ERROR TYPES

export enum ErrorMessages {
  PARSE_ROUTE_FAILURE = "Unable to parse route",
  FIND_ENTRY_FAILURE = "Unable to find entry"
}
// Merge
export enum ErrorTypes {
  Nodeback = "Node standard callback failure",
  DataParsing = "Data parsing failure"
}

export class AppError {
  type: ErrorTypes;
  functionName: string
  details: {} | string;
  constructor(type: ErrorTypes, functionName: string, details: {} | string) {
    this.type = type;
    this.functionName = functionName;
    this.details = details;
  }
}



