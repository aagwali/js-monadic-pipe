import { prop } from 'ramda'

export enum AppFailure {
  BuildSettings = 'Application failed to build job settings from command args',
  BuildConfig = 'Application failed to build configuration from dotEnv',
  UpsertBullMsg = 'upsertBullMsg',
  GetBatches = 'GetBatches',
  UnlinkFiles = 'unlinkFiles',
  RemoveDirectory = 'removeDirectory',
  DeletionTask = 'deletionTask',
  UNKNOWN = '⚠ unregistered error ⚠'
}

export type AppError = {
  applicationFailure: AppFailure
  details: string
}

export const parseValidationError = x => prop('details', x).map(prop('message'))

export const formatError = (errLocation: AppFailure) => (
  error: any
): AppError => {
  return {
    applicationFailure: errLocation,
    details: error
  }
}
