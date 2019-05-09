import { AppError, ErrorLocation as at } from '../errors'
import { Config, buildConfig, configEnvMapping, Env } from '../types'
import { tryValidate } from '../utils'
import { prop, values } from 'ramda'
import {
  formatError as throwFuturErr,
  AsyncEither,
  futureOfValue as futurV,
  futureRejectOfValue as rejAsFutur
} from 'ts-functors'

export const tryValidateEnvKeys = (
  mandatoryKeys: string[],
  env: Env
): AsyncEither<AppError, void> =>
  mandatoryKeys
    .map(tryValidate(env)(prop))
    .reduce((acc, validation) => validation.ap(acc.acc()))
    .fold(rejAsFutur, futurV)
    .mapRej((e: any) => throwFuturErr(at.TryValidateEnvKeys)(e))

export const tryBuildConfig = (env: Env): AsyncEither<AppError, Config> =>
  tryValidateEnvKeys(values(configEnvMapping), env).map(buildConfig)
