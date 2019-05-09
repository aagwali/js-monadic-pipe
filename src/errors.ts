import { FuturError } from 'ts-functors'

export enum ErrorLocation {
  TryValidateEnvKeys = 'tryValidateEnvKeys failed to validate mandatory env keys :',
  TryUpsertBullMsg = 'tryUpsertBullMsg',
  BrowseMsSupplierDirectory = 'browseMsSupplierDirectory',
  GetBatches = 'GetBatches',
  UnlinkFiles = 'unlinkFiles',
  RemoveDirectory = 'removeDirectory',
  DeletionTask = 'deletionTask',
  UNKNOWN = '⚠ unregistered error ⚠'
}

export type AppError = FuturError<ErrorLocation>
