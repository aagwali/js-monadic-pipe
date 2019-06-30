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

const args: Seq = require('yargs').argv

const runProcess = (conf: Config): FutureInstance<AppError, any> =>
  Job.parseSettings(args)
    .chain(Spot.getTargetDatas(conf))
    .chain(Nas.getTargetDatas)
// .chain(Pcm.getTargetDatas(conf))

export const main = () =>
  parseConfig(process.env)
    // .chain(connectDb)
    .chain(runProcess)
    .fork(log, log)
