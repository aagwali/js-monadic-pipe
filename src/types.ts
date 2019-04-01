export type InitialInput = {
  content: string;
};

export enum ErrorTypes {
  Nodeback = "Node standard callback failure",
  DataParsing = "Data parsing failure"
}

export type AppError = {
  type: ErrorTypes;
  functionName: string
  details: {} | string;
}

export enum ErrorMessages {
  PARSE_ROUTE_FAILURE = "Unable to parse route",
  FIND_ENTRY_FAILURE = "Unable to find entry"
}
