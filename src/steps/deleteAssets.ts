import { Batch, Task, TaskStatus, DeletionTask } from '../types'
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
  identity as id
} from 'ramda'
import { launchProcess as executeConcurrently } from '../concurrencyHelper'
import {
  futureFromNodeback as futurN,
  futureOfValue as futurV,
  formatError as throwFuturErr,
  AsyncEither,
  futureOfPromise as futureOfP
} from 'ts-functors'
import { ErrorLocation as at, AppError } from '../errors'
import { log } from '../utils'

const endedTaskFiles: (batches: Batch[]) => string[] = pipe(
  map((b: Batch) => b.tasks),
  flatten,
  filter((t: any) => t.status === TaskStatus.Ended),
  map((t: Task) => t.sourceURI),
  uniq
)

const endedBatchFolders = (batches: Batch[]) =>
  batches
    .filter((b: Batch) => not(isEmpty(b.tasks)))
    .filter((b: Batch) =>
      all(task => task.status === TaskStatus.Ended, b.tasks)
    )
    .map((b: Batch) =>
      join('/', init(split('/', prop('sourceURI', head(b.tasks)))))
    )

export const buildDeletionTask = (batches: Batch[]): DeletionTask =>
  new DeletionTask(endedTaskFiles(batches), endedBatchFolders(batches))

const buildResults = (
  unlinkErrors: any[],
  rmdirErrors: any[],
  task: DeletionTask
): DeletionTask => {
  const relevantErrors = (x: Error): boolean =>
    !x.message.includes('ENOENT: no such file or directory, unlink')
  return {
    ...task,
    fileDeletionErrors: unlinkErrors
      .map(x => new Error(x))
      .filter(relevantErrors)
      .map(x => x.message),
    folderDeletionErrors: rmdirErrors.map(x => new Error(x)).map(x => x.message)
  }
}

const unlink = (filePath: string[]): Promise<any> =>
  futurN(fs.unlink)(filePath)
    .mapRej((e: AppError) => throwFuturErr(at.UnlinkFiles)(e))
    .promise()

const rmdir = (folderPath: string[]): Promise<any> =>
  futurN(fs.rmdir)(folderPath)
    .mapRej((e: AppError) => throwFuturErr(at.RemoveDirectory)(e))
    .promise()

export const executeDeletionTask = (maxTasks: string) => (
  task: DeletionTask
): AsyncEither<any, DeletionTask> =>
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
