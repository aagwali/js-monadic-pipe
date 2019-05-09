import { Batch, Task, TaskStatus, DeletionTask } from '../types'
import { ErrorLocation as errAt, AppError } from '../errors'
import Future, {
  FutureInstance as AsyncEither,
  tryP as FutureOfPromise
} from 'fluture'
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
  not
} from 'ramda'
import { futureFromNodeback as ifNodebackRejects } from '../monadic-api'
import { launchProcess as executeConcurrently } from '../concurrencyHelper'
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
  unlinkErrors: AppError[],
  rmdirErrors: AppError[],
  task: DeletionTask
): DeletionTask => {
  const relevantErrors = (x: AppError) =>
    !x.error.message.includes('ENOENT: no such file or directory, unlink')
  return {
    ...task,
    fileDeletionErrors: unlinkErrors
      .filter(relevantErrors)
      .map(x => x.error.message),
    folderDeletionErrors: rmdirErrors.map(x => x.error.message)
  }
}

const unlink = (filePath: string[]): Promise<any> =>
  ifNodebackRejects(errAt.UNLINK_FILES)(fs.unlink)(filePath)([]).promise()

const rmdir = (folderPath: string[]): Promise<any> =>
  ifNodebackRejects(errAt.REMOVE_DIRECTORY)(fs.rmdir)(folderPath)([]).promise()

export const executeDeletionTask = (maxTasks: string) => (
  task: DeletionTask
): AsyncEither<any, any> =>
  FutureOfPromise(() =>
    executeConcurrently(unlink, Number(maxTasks), task.filePathes)
  ).chain(unlinkErrors =>
    FutureOfPromise(() =>
      executeConcurrently(rmdir, Number(maxTasks), task.folderPathes)
    ).map(rmdirErrors => buildResults(unlinkErrors, rmdirErrors, task))
  )
