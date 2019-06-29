import { node, FutureInstance, Future } from 'fluture'
import { values } from 'ramda'
import Joi from 'joi'
import { UserSettings, ActionType, ReportError } from './types'
import { Seq } from '../generics/config'
import * as Spot from './spot'
import {
  AppFailure as at,
  AppError,
  formatError,
  joiError
} from '../generics/errors'

const returnSettings = (args: Seq): UserSettings => {
  return {
    action: args.action,
    target: args.target,
    options: {
      errorFilter: args.errorFilter
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
      .default(ReportError.None)
  })
  .unknown()

export const parseSettings = (
  args: Seq
): FutureInstance<AppError, UserSettings> =>
  node(cb => Joi.validate(args, argsSchema, cb)).bimap(
    formatError(joiError, at.ParseSettings),
    returnSettings
  )
