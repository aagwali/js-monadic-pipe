import { Config } from './modules/generics/config'
import { buildConfig, Seq } from './modules/generics/config'
import * as JobConfig from './modules/business/jobConfiguration'
import { log } from './modules/generics/utlis'
import { connect as connectDb } from './modules/generics/database'

const args: Seq = require('yargs').argv

const run = (startTime: Date) => (conf: Config) => JobConfig.buildSettings(args)

export const main = () =>
  buildConfig(process.env)
    .chain(connectDb)
    .chain(run(new Date()))
    .fork(log, log)
