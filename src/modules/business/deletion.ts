import * as FileExp from './fileExporter'
import fs from 'fs'
import { launchProcess as executeConcurrently } from '../generics/concurrency'
import {
  futureFromNodeback as futurN,
  formatError as throwErr,
  FutureInstance as Future,
  futureOfPromise as futureOfP,
  log,
  logx
} from 'ts-functors'
import {
  formatErrors,
  Application as AppError,
  ErrorLocation as at,
  FileSystem as FsError
} from '../generics/errors'
import { List } from 'monet' //

//#region Types

export type DeletionTask = {
  filePathes: List<string>
  directoryPathes: List<string>
}

export type DeletionResult = {
  fileDeletionErrors: string[]
  folderDeletionErrors: string[]
}

//#endregion

export const buildTask = (batches: List<FileExp.Batch>): DeletionTask => {
  return {
    filePathes: FileExp.endedTasksFilePathes(batches),
    directoryPathes: FileExp.completeBatchDirectoryPathes(batches)
  }
}

const buildResult = (
  unlinkErrors: NodeJS.ErrnoException[],
  rmdirErrors: NodeJS.ErrnoException[]
): DeletionResult => {
  return {
    fileDeletionErrors: formatErrors(unlinkErrors),
    folderDeletionErrors: formatErrors(rmdirErrors)
  }
}

const unlink = (filePath: string): Promise<any> =>
  futurN(fs.unlink)(filePath).promise()

const rmdir = (folderPath: string): Promise<any> =>
  futurN(fs.rmdir)(folderPath).promise()

export const executeTask = (maxTasks: string) => (
  deletionTask: DeletionTask
): Future<AppError, [DeletionTask, DeletionResult]> =>
  futureOfP(
    executeConcurrently(
      unlink,
      Number(maxTasks),
      deletionTask.filePathes.toArray()
    )
  )
    .chain((unlinkErrors: FsError[]) =>
      futureOfP(
        executeConcurrently(
          rmdir,
          Number(maxTasks),
          deletionTask.directoryPathes.toArray()
        )
      ).map((rmdirErrors: FsError[]) => buildResult(unlinkErrors, rmdirErrors))
    )
    .bimap(throwErr(at.DeletionTask), deletionresult => [
      deletionTask,
      deletionresult
    ])
