import { node, FutureInstance, Future } from 'fluture'
import { values } from 'ramda'
import Joi from 'joi'
import {
  UserSettings,
  ActionType,
  ReportError,
  MasterMode,
  SourceData
} from './types'
import { Seq } from '../generics/config'
import {
  AppFailure,
  AppError,
  formatError,
  parseJoiValidationError
} from '../generics/errors'
import { futurSpinnerWrapper as logStep } from '../generics/utlis'

const mapSettings = (args: Seq): UserSettings => {
  return {
    action: args.action,
    target: args.target,
    options: {
      errorFilter: args.errorFilter,
      forceRecheck: args.forceRecheck,
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
    target: Joi.string().required(),
    errorFilter: Joi.string()
      .valid(values(ReportError))
      .default(ReportError.None),
    forceRecheck: Joi.boolean().default(false),
    replaceNas: Joi.boolean().default(false),
    deprecatePreviousRelation: Joi.boolean().default(false),
    indexationMasterMode: Joi.string()
      .valid(values(MasterMode))
      .when('action', { is: ActionType.Index, then: Joi.required() }),
    indexationSource: Joi.string()
      .valid(values(SourceData))
      .when('action', { is: ActionType.Index, then: Joi.required() })
  })
  .unknown()

export const parseSettings = (
  args: Seq
): FutureInstance<AppError, UserSettings> =>
  node(cb => Joi.validate(args, argsSchema, cb))
    .mapRej(parseJoiValidationError)
    .bimap(formatError(AppFailure.ParseSettings), mapSettings)
