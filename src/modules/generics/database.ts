import mongoose from 'mongoose'
import {
  parseMongoParseError,
  formatError,
  AppFailure,
  AppError
} from './errors'
import { encaseP2, FutureInstance } from 'fluture'
import { Config } from './config'
import { always } from 'ramda'
import { futurSpinnerWrapper as logStep } from './utlis'

export const connect = (conf: Config): FutureInstance<AppError, Config> =>
  logStep(
    [` ⴵ - Connecting to ${conf.mongoDbUri}`, ` ☑ - Connection established`],
    encaseP2(mongoose.connect, encodeURI(conf.mongoDbUri), {
      useNewUrlParser: true,
      useFindAndModify: false
    })
      .mapRej(parseMongoParseError)
      .bimap(formatError(AppFailure.ConnectMongo), always(conf))
  )
