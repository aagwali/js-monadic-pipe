import { Batch, Task, TaskStatus, DeletionTask } from '../types'
import { ErrorLocations as errAt } from '../errors'
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
  prop
} from 'ramda'
import {
  futureFromNodeback as ifNodebackRejects,
  promisesToDefaultValFuture as awaitPromisesThenFutureOf
} from '../monadic-api'
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
    .filter(batch => all(task => task.status === TaskStatus.Ended, batch.tasks))
    .map(batch =>
      join('/', init(split('/', prop('sourceURI', head(batch.tasks)))))
    )
//what if list batch empty
//what if list task empty

export const buildDeletionTask = (batches: Batch[]): DeletionTask =>
  new DeletionTask(endedTaskFiles(batches), endedBatchFolders(batches))

const buildResults = (
  unlinkErrors: Error[],
  rmdirErrors: Error[],
  task: DeletionTask
): DeletionTask => {
  return {
    ...task,
    fileDeletionErrors: unlinkErrors.map(x => x.message),
    folderDeletionErrors: rmdirErrors.map(x => x.message)
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
