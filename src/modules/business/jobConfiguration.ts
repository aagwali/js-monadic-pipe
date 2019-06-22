import { node as futurN, FutureInstance as Future } from 'fluture'
import { values, prop } from 'ramda'
import Joi, { ValidationError } from 'joi'
import {
  UserSettings,
  ActionType,
  ScopeTarget,
  ChunkType,
  ReportError,
  MasterMode,
  SourceData
} from './types'
import { Seq } from '../generics/config'
import {
  AppFailure,
  AppError,
  formatError,
  parseValidationError
} from '../generics/errors'

const mapSettings = (args: Seq): UserSettings => {
  return {
    action: args.action,
    scope: {
      target: args.scopeTarget,
      chunkType: args.chunkType,
      chunkValue: args.chunkValue
    },
    options: {
      errorFilter: args.errorFilter,
      forceRecheck: args.forceRecheck,
      PCMreplaceNas: args.PCMreplaceNas,
      VECnonIndexedReport: args.VECnonIndexedReport,
      deprecatePreviousRelation: args.deprecatePreviousRelation,
      indexationOptions: {
        masterMode: args.indexationMasterMode,
        sourceData: args.indexationSource
      }
    }
  }
}

const argsSchema = Joi.object()
  .keys({
    action: Joi.string()
      .valid(values(ActionType))
      .required(),
    scopeTarget: Joi.string()
      .valid(values(ScopeTarget))
      .required(),
    chunkType: Joi.string()
      .valid(values(ChunkType))
      .required(),
    chunkValue: Joi.any().required(),
    errorFilter: Joi.string()
      .valid(values(ReportError))
      .default(ReportError.None),
    forceRecheck: Joi.boolean().default(false),
    PCMreplaceNas: Joi.boolean().default(false),
    VECnonIndexedReport: Joi.boolean().default(false),
    deprecatePreviousRelation: Joi.boolean().default(false),
    indexationMasterMode: Joi.string()
      .valid(values(MasterMode))
      .when('action', { is: ActionType.Index, then: Joi.required() }),
    indexationSource: Joi.string()
      .valid(values(SourceData))
      .when('action', { is: ActionType.Index, then: Joi.required() })
  })
  .unknown()

export const buildSettings = (args: Seq): Future<AppError, UserSettings> =>
  futurN(cb => Joi.validate(args, argsSchema, cb))
    .mapRej((x: ValidationError) => parseValidationError(x))
    .bimap(formatError(AppFailure.BuildSettings), mapSettings)
