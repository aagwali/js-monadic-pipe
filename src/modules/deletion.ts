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
  last
} from 'ramda'
import { launchProcess as executeConcurrently } from '../concurrencyHelper'
import {
  futureFromNodeback as futurN,
  formatError as throwFuturErr,
  FutureInstance as Future,
  futureOfPromise as futureOfP,
  log,
  logx
} from 'ts-functors'
import { ErrorLocation as at, AppError, ErrorLocation } from './errors'
import { List, Validation } from 'monet' //
import tail from 'ramda/es/tail'
const ListArr = List.fromArray //

export class DeletionTask {
  filePathes: string[]
  folderPathes: string[]
  fileDeletionErrors: any
  folderDeletionErrors: string[]
  constructor(
    filePathes,
    folderPathes,
    fileDeletionErrors = [],
    folderDeletionErrors = []
  ) {
    this.filePathes = filePathes
    this.folderPathes = folderPathes
    this.fileDeletionErrors = fileDeletionErrors
    this.folderDeletionErrors = folderDeletionErrors
  }
}

const endedTaskFiles: (batches: FileExp.Batch[]) => string[] = pipe(
  map((b: FileExp.Batch) => b.tasks),
  flatten,
  filter((t: any) => t.status === FileExp.TaskStatus.Ended),
  map((t: FileExp.Task) => t.sourceURI),
  uniq
)

const endedBatchFolders = (batches: FileExp.Batch[]) =>
  batches
    .filter((b: FileExp.Batch) => not(isEmpty(b.tasks)))
    .filter((b: FileExp.Batch) =>
      all((t: FileExp.Task) => t.status === FileExp.TaskStatus.Ended, b.tasks)
    )
    .map((b: FileExp.Batch) =>
      join('/', init(split('/', prop('sourceURI', head(b.tasks)))))
    )

export const buildTask = (batches: FileExp.Batch[]): DeletionTask =>
  new DeletionTask(endedTaskFiles(batches), endedBatchFolders(batches), [], []) // regression

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

const buildResults = (
  unlinkErrors: any[],
  rmdirErrors: AppError[],
  task: DeletionTask
): DeletionTask => {
  return {
    ...task,
    fileDeletionErrors: ListArr(unlinkErrors)
      // .map(last)
      .map(x => x[1]) // stopped here
      .map(log) // stopped here
      .filter(relevantFileError)
      .map(relevantErrorData)
    // folderDeletionErrors: rmdirErrors.map(relevantErrorData)
  }
}

const unlink = (filePath: string): Promise<any> =>
  futurN(fs.unlink)(filePath)
    .mapRej((e: NodeJS.ErrnoException) => throwFuturErr(at.UnlinkFiles)(e))
    .promise()

const rmdir = (folderPath: string): Promise<any> =>
  futurN(fs.rmdir)(folderPath)
    .mapRej((e: NodeJS.ErrnoException) => throwFuturErr(at.RemoveDirectory)(e))
    .promise()

export const executeTask = (maxTasks: string) => (
  task: DeletionTask
): Future<AppError, DeletionTask> => // fake Left / True Right
  futureOfP(
    executeConcurrently(unlink, Number(maxTasks), task.filePathes)
  ).chain(unlinkErrors =>
    futureOfP(
      executeConcurrently(rmdir, Number(maxTasks), task.folderPathes)
    ).bimap(
      (e: any) => throwFuturErr(at.DeletionTask)(e),
      rmdirErrors => buildResults(unlinkErrors, rmdirErrors, task)
    )
  )
