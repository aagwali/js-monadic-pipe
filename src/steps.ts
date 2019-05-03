import {
  path,
  __,
  pipe,
  find,
  equals,
  split,
  concat,
  nth,
  always as id
} from 'ramda'
import { AppError, ErrorLocations as errAt } from './errors'
import { log } from './utils'
import {
  futureFromMaybe as ifUndefined,
  futureFromNodeback as ifNodebackRejects,
  futureFromPromise as ifPromiseRejects,
  resolveDefault
} from './monadic-api'
import fs from 'fs'
import { InitialInput, Config } from './types'
import { Future, FutureInstance as AsyncEither } from 'fluture'
import { createRepeatableMsg } from './jobsManagementHelper'
import Bull from 'bull'

export const readLine = line =>
  pipe(
    split('\n'),
    nth(line)
  )

export const tryFindInArray = <T>(search: T) => (
  input: T[]
): AsyncEither<AppError, T> =>
  ifUndefined(errAt.TRY_FIND_IN_ARRAY, search)(find(equals(search)))(input)

export const asyncReaddir = (
  folderpath: string
): AsyncEither<AppError, string[]> =>
  ifNodebackRejects(errAt.READDIR)(fs.readdir)(folderpath)([])

export const tryMakeFilePath = ({ fileName, fileName_fallback }: Config) => (
  folderContent: string[]
): AsyncEither<AppError, string> =>
  Future.of(folderContent)
    .chain(tryFindInArray(fileName))
    .chainRej(resolveDefault(fileName_fallback))
    .map(concat(`./src/`))
    .mapRej((x: AppError) => x)

export const asyncReadFile = (
  filePath: string
): AsyncEither<AppError, string[]> =>
  ifNodebackRejects(errAt.READ_FILE)(fs.readFile)(filePath)(['utf8'])

export const tryReadLine = (line: number) => (
  input: string[]
): AsyncEither<AppError, string> =>
  ifUndefined(errAt.TRY_READ_LINE, line)(readLine(line))(input)

export const readFileSystem = (config: Config) => (
  payload: string
): AsyncEither<AppError, string> =>
  Future.of(payload)
    .map(concat('./'))
    .chain(asyncReaddir)
    .chain(tryMakeFilePath(config))
    .chain(asyncReadFile)
    .chain(tryReadLine(Number(config.fileLine)))
    .mapRej((x: AppError) => x)

export const tryFindPath = (route: Array<string | number>) => (
  input: InitialInput
): AsyncEither<AppError, string> =>
  ifUndefined(errAt.TRY_FIND_PATH, route)(path(route))(input)

export const tryUpsertBullMsg = (jobFrequency: string) => (
  queue: Bull.Queue<any>
): AsyncEither<AppError, any> =>
  ifPromiseRejects(errAt.TRY_UPSERT_BULL_MSG)(
    createRepeatableMsg(jobFrequency)
  )(queue).map(_ => queue)
