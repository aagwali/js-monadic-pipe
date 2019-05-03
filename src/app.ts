import { readFileSystem, tryFindPath, tryUpsertBullMsg } from './steps'
import { tryBuildConfig, log } from './utils'
import { InitialInput, AppSuccess, Config } from './types'
import { Future } from 'fluture'
import Queue from 'bull'
import Bull from 'bull'
import * as Job from './jobsManagementHelper'
import { AppError } from './errors'

const input: InitialInput = { folder: 'src' }

const start = (config: Config, queue: Bull.Queue<any>) => {
  const startTime = new Date()
  queue.process(
    (job: Bull.Job<any>, acknowledge: Bull.DoneCallback): void => {
      Future.of(input)
        .chain(tryFindPath([config.requiredProp]))
        .chain(readFileSystem(config))
        .map(x => new AppSuccess(x))
        .fork(
          Job.failure(acknowledge),
          Job.success(job, acknowledge, startTime)
        )
    }
  )
}

const upsertScheduledMsg = (config: Config) =>
  Future.of(new Queue(config.bullQueueName, config.bullRedisUrl))
    .chain(tryUpsertBullMsg(config.jobFrequency))
    .fork(log, queue => start(config, queue))

export const validateConfig = () =>
  tryBuildConfig(process.env).fold(log, upsertScheduledMsg)
