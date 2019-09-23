import { Config } from './modules/generics/config'
import { parseConfig, Seq } from './modules/generics/config'
import * as Job from './modules/business/jobConfiguration'
import * as Spot from './modules/business/spot'
import * as Nas from './modules/business/nas'
import * as Pcm from './modules/business/pcm'
import { log } from './modules/generics/utlis'
import { connect as connectDb } from './modules/generics/database'
import { node, FutureInstance, Future } from 'fluture'
import { AppError } from './modules/generics/errors'
import { listOp } from './mock'

const distinctValues = listOp.filter((v, i, a) => a.indexOf(v) === i)

export const main = () =>
  parseConfig(process.env)
    .chain(Pcm.launchIndex(distinctValues))
    .fork(log, log)
