import { FuturError } from 'ts-functors'
import { prop, not, any, pick, whereEq } from 'ramda'

export enum ErrorLocation {
  TryBuildConfig = 'tryValidateEnvKeys failed for :',
  UpsertBullMsg = 'upsertBullMsg',
  BrowseMsSupplierDirectory = 'browseMsSupplierDirectory',
  GetBatches = 'GetBatches',
  UnlinkFiles = 'unlinkFiles',
  RemoveDirectory = 'removeDirectory',
  DeletionTask = 'deletionTask',
  UNKNOWN = '⚠ unregistered error ⚠'
}

export type Application = FuturError<ErrorLocation>

export type FileSystem = NodeJS.ErrnoException

const irrelevantErrors: FileSystem[] = [
  {
    syscall: 'unlnk',
    code: 'ENOENT',
    errno: -2,
    name: '',
    message: ''
  }
]

const fsErrorKeys = ['syscall', 'code', 'errno']

export const relevantError = (error: FileSystem): boolean =>
  not(any(whereEq(pick(fsErrorKeys, error)), irrelevantErrors))

export const formatErrors = (errors: FileSystem[]): string[] =>
  errors.filter(relevantError).map(prop('message'))
