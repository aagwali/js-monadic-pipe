import { map, replace, applySpec, always } from 'ramda'
import { ErrorLocation as Location, AppError2 as AppError } from '../errors'
import { Batch } from '../types'
import { postHttp } from '../apiHelper'
import {
  futureFromPromise as futurP,
  futureOfValue as futurV,
  AsyncEither,
  captureError as futurErr
} from 'ts-functors'
import { mapRej } from 'fluture'

export const adjustInput = map(replace('_', '-'))

export const buildPayload = applySpec({
  limit: always(0),
  keys: adjustInput
})

export const getBatches = (fileExporterUri: string) => (
  directories: string[]
): AsyncEither<AppError, Batch[]> =>
  futurV(directories)
    .map(buildPayload)
    .chain(futurP(postHttp(fileExporterUri)))
    .mapRej(futurErr(Location.GetBatches))
