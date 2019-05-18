import * as FileExp from '../modules/fileExporter'
import fs from 'fs'
import {
  filter,
  pipe,
  map,
  flatten,
  uniq,
  split,
  all,
  head,
  init,
  join,
  prop,
  isEmpty,
  not,
  equals,
  identity as id,
  applySpec,
  last,
  always
} from 'ramda'
import { launchProcess as executeConcurrently } from './concurrency'
import {
  futureFromNodeback as futurN,
  formatError as throwErr,
  FutureInstance as Future,
  futureOfPromise as futureOfP,
  log,
  logx
} from 'ts-functors'
import { ErrorLocation as at, AppError, ErrorLocation } from './errors'
import { List, Validation } from 'monet' //
const ListArr = List.fromArray //

//#region Types

export type DeletionTask = {
  filePathes: List<string>
  directoryPathes: List<string>
}

export type DeletionResult = {
  fileDeletionErrors: any
  folderDeletionErrors: string[]
}

//#endregion

export const buildTask = (batches: List<FileExp.Batch>): DeletionTask => {
  return {
    filePathes: FileExp.endedTasksFilePathes(batches),
    directoryPathes: FileExp.completeBatchDirectoryPathes(batches)
  }
}

const relevantsError: NodeJS.ErrnoException[] = [
  {
    syscall: 'unlink',
    code: 'ENOENT',
    errno: -2,
    name: '',
    message: ''
  }
]

const relevantFileError = (err: any): boolean =>
  not(equals(prop('code')(err), 'ENOENT'))

const relevantErrorData = (err: NodeJS.ErrnoException): string =>
  prop('message')(err)

const buildResult = (
  unlinkErrors: any[],
  rmdirErrors: AppError[]
): DeletionResult => {
  return {
    fileDeletionErrors: ListArr(unlinkErrors)
      // .map(map(log))
      .map(x => x[1]) // stopped here
      // .filter(relevantFileError)
      .map(relevantErrorData),
    folderDeletionErrors: []
  }
}

const unlink = (filePath: string): Promise<any> =>
  futurN(fs.unlink)(filePath)
    .mapRej((e: NodeJS.ErrnoException) => throwErr(at.UnlinkFiles)(e))
    .promise()

const rmdir = (folderPath: string): Promise<any> =>
  futurN(fs.rmdir)(folderPath)
    .mapRej((e: NodeJS.ErrnoException) => throwErr(at.RemoveDirectory)(e))
    .promise()

export const executeTask = (maxTasks: string) => (
  deletionTask: DeletionTask
): Future<AppError, [DeletionTask, DeletionResult]> => // fake Left / True Right
  futureOfP(
    executeConcurrently(
      unlink,
      Number(maxTasks),
      deletionTask.filePathes.toArray()
    )
  )
    .chain(unlinkErrors =>
      futureOfP(
        executeConcurrently(
          rmdir,
          Number(maxTasks),
          deletionTask.directoryPathes.toArray()
        )
      ).map(rmdirErrors => buildResult(unlinkErrors, rmdirErrors))
    )
    .bimap(throwErr(at.DeletionTask), deletionresult => [
      deletionTask,
      deletionresult
    ])
