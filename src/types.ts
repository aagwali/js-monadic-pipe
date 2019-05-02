
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




