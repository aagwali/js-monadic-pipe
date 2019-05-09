import fs from 'fs'
import { ErrorLocation as at, AppError } from '../errors'
import { filter, identity as id, always } from 'ramda'
import {
  futureFromNodeback as futurN,
  futureOfValue as futurV,
  formatError as throwFuturErr,
  AsyncEither
} from 'ts-functors'

const isDirectory = (base: string) => (iterate: string): boolean =>
  fs.lstatSync(`${base}/${iterate}`).isDirectory()

const filterDirectories = (basePath: string) => (
  directoryContent: string[]
): string[] => filter(isDirectory(basePath), directoryContent)

const getDirectoryContent = futurN(fs.readdir)

export const browseSupplierDirectory = (
  dirPath: string
): AsyncEither<AppError, string[]> =>
  futurV(dirPath)
    .chain(getDirectoryContent)
    .map(filterDirectories(dirPath))
    .bimap(
      (e: AppError) => throwFuturErr(at.BrowseMsSupplierDirectory)(e),
      (output: string[]) => id(output)
    )
