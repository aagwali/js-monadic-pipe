import { Config } from './modules/generics/config'
import { parseConfig, Seq } from './modules/generics/config'
import * as Job from './modules/business/jobConfiguration'
import * as Spot from './modules/business/spot'
import * as Report from './modules/business/integrityReport'
import { log } from './modules/generics/utlis'
import { connect as connectDb } from './modules/generics/database'
import { node, FutureInstance, Future } from 'fluture'
import { AppError } from './modules/generics/errors'

const args: Seq = require('yargs').argv

const runProcess = (conf: Config): FutureInstance<AppError, any> =>
  Job.parseSettings(args)
    .map(Spot.getOperationInfos(conf))
    .map(Report.writeDam(conf))
    .map(Report.writeNas(conf))
    .map(Report.writePim(conf))
    .map(Report.generate(conf))
    .map(Report.repairErrors(conf))

export const main = () =>
  parseConfig(process.env)
    .chain(connectDb)
    .chain(runProcess)
    .fork(log, Report.statusExtract)
