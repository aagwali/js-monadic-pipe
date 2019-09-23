import mongoose from 'mongoose'
import {
  standardError as stdErr,
  formatError,
  AppFailure as at
} from './errors'
import { encaseP2, FutureInstance } from 'fluture'
import { Config } from './config'
import { always } from 'ramda'
import { futurSpinnerWrapper as logStep } from './utlis'

export const connect = (conf: Config): FutureInstance<any, any> =>
  logStep(
    [` ⴵ - Connecting to ${'MONGO_URI_CONF'}`, ` ☑ - Connection established`],
    encaseP2(mongoose.connect, encodeURI('MONGO_URI_CONF'), {
      useNewUrlParser: true,
      useFindAndModify: false
    })
  ).bimap(formatError(stdErr, at.ConnectMongo), always(conf))
