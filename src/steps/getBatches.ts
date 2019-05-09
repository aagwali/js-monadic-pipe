import { map, replace, applySpec, always, identity as id } from 'ramda'
import { ErrorLocation as at, AppError } from '../errors'
import { Batch, FileExporterPayload } from '../types'
import { postHttp } from '../apiHelper'
import {
  futureFromPromise as futurP,
  futureOfValue as futurV,
  AsyncEither,
  formatError as throwFuturErr
} from 'ts-functors'

export const adjustInput = map(replace('_', '-'))

export const buildPayload: (
  directories: string[]
) => FileExporterPayload = applySpec({
  limit: always(0),
  keys: adjustInput
})

export const getFileExporterBatches = (fileExporterUri: string) => (
  directories: string[]
): AsyncEither<AppError, Batch[]> =>
  futurV(directories)
    .map(buildPayload)
    .chain(futurP(postHttp(fileExporterUri)))
    .bimap(
      (e: AppError) => throwFuturErr(at.GetBatches)(e),
      (output: Batch[]) => id(output)
    )
