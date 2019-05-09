import fs from 'fs'
import { FutureInstance as AsyncEither } from 'fluture'
import { ErrorLocation as Location, AppError2 as AppError } from '../errors'
import R from 'ramda'
import {
  futureFromNodeback as futurN,
  futureOfValue as futurV,
  captureError as formatError
} from 'ts-functors'

const isDirectory = (basePath: string) => (result: string): boolean =>
  fs.lstatSync(`${basePath}/${result}`).isDirectory()
// unhandled async fs action

export const browseMsSupplierFolder = (
  folderPath: string
): AsyncEither<AppError, string[]> =>
  futurV(folderPath)
    .chain(futurN(fs.readdir, Location.BrowseMsSupplierFolder))
    .map(α => R.filter(isDirectory(folderPath), α))
    .mapRej(formatError(Location.GetBatches))
