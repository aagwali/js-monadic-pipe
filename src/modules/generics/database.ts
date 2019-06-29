import mongoose from 'mongoose'
import { mongoError, formatError, AppFailure as at } from './errors'
import { encaseP2, FutureInstance } from 'fluture'
import { Config } from './config'
import { always } from 'ramda'
import { futurSpinnerWrapper as logStep } from './utlis'

export const connect = (conf: Config): FutureInstance<any, any> =>
  logStep(
    [` ⴵ - Connecting to ${conf.mongoDbUri}`, ` ☑ - Connection established`],
    encaseP2(mongoose.connect, encodeURI(conf.mongoDbUri), {
      useNewUrlParser: true,
      useFindAndModify: false
    })
  ).bimap(formatError(mongoError, at.ConnectMongo), always(conf))
