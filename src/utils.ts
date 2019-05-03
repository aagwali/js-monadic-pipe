import { Validation, IValidationAcc } from 'monet'
import { AppError, buildError, ErrorLocations as errAt } from './errors'
import { Config, buildConfig, configEnvMapping } from './types'
import { validationFromMaybe as tryValidate } from './monadic-api'
import R from 'ramda'

export const log = R.tap(console.log)

export const tryValidateEnvKeys = (
  mandatoryKeys: string[],
  env: any
): Validation<string[], IValidationAcc> =>
  mandatoryKeys
    .map(tryValidate(env)(R.prop))
    .reduce((acc, validation) => validation.ap(acc.acc()))

export const tryBuildConfig = (env: any): Validation<AppError, Config> =>
  tryValidateEnvKeys(R.values(configEnvMapping), env)
    .map(() => buildConfig(env))
    .failMap(errDetails => buildError(errAt.VALIDATE_ENV_KEY, errDetails))
