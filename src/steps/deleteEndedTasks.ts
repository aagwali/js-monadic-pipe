import { Batch, Task, TaskStatus, DeletionResults } from '../types'
import { ErrorLocations as errAt } from '../errors'
import { Future, FutureInstance as AsyncEither } from 'fluture'
import fs from 'fs'
import { filter, pipe, map, flatten, uniq } from 'ramda'
import {
  futureFromNodeback as ifNodebackRejects,
  promisesToDefaultValFuture as awaitPromiseThenFutureOf
} from '../monadic-api'
import { launchProcess as resolvePromisesConcurently } from '../concurrencyHelper'
import { log } from '../utils'

const unlinkFiles = (DeletionResults: DeletionResults) => (
  filePath: string[]
): Promise<any> =>
  new Promise<any>(resolve => {
    ifNodebackRejects(errAt.UNLINK_FILES)(fs.unlink)(filePath)([])
      .promise()
      .then(success => {
        DeletionResults.fileDeletion.success.push(success)
        resolve()
      })
      .catch(error => {
        DeletionResults.fileDeletion.failure.push(error)
        resolve()
      })
  })

const deleteFilesConcurrently = (
  maxTasks: string,
  resultsValues: DeletionResults
) => (filePathes: string[]): AsyncEither<any, DeletionResults> =>
  Future.of(resultsValues)
    .map(resolvePromisesConcurently(unlinkFiles, filePathes, Number(maxTasks)))
    .chain(awaitPromiseThenFutureOf(resultsValues))

const filesWithIncompletedTasks: (batches: Array<Batch>) => string[] = pipe(
  map((b: Batch) => b.tasks),
  flatten,
  filter((t: any) => t.status === TaskStatus.Ended),
  map((t: Task) => t.sourceURI),
  uniq
)

export const deleteEndedTasks = (maxSimultaneousTask: string) => (
  batches: Batch[]
): AsyncEither<any, DeletionResults> =>
  Future.of(batches)
    .map(filesWithIncompletedTasks)
    .chain(deleteFilesConcurrently(maxSimultaneousTask, new DeletionResults()))
