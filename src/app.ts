import { Config } from './modules/generics/config'
import { parseConfig, Seq } from './modules/generics/config'
import * as JobConfig from './modules/business/jobConfiguration'
import * as Report from './modules/business/integrityReport'
import { log } from './modules/generics/utlis'
import { connect as connectDb } from './modules/generics/database'

const args: Seq = require('yargs').argv

const runProcess = (conf: Config) =>
  JobConfig.parseSettings(args)
    .map(Report.checkExistence(conf))
    .map(Report.writePcm(conf))
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
