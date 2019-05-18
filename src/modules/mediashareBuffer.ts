import fs from 'fs'
import { ErrorLocation as at, AppError } from './errors'
import { filter } from 'ramda'
import {
  futureFromNodeback as futurN,
  formatError as throwErr,
  FutureInstance as Future
} from 'ts-functors'

const isDirectory = (basePath: string) => (entry: string): boolean =>
  fs.lstatSync(`${basePath}/${entry}`).isDirectory()

const filterDirectories = (basePath: string) => (entries: string[]): string[] =>
  filter(isDirectory(basePath), entries)

export const browseDirectories = (path: string): Future<AppError, string[]> =>
  futurN(fs.readdir)(path).bimap(
    throwErr(at.BrowseMsSupplierDirectory),
    filterDirectories(path)
  )
