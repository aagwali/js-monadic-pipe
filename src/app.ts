import { Config } from './types'
import Queue from 'bull'
import Bull from 'bull'
import { Future } from 'fluture'
import { tryBuildConfig, log } from './utils'
import * as Job from './jobsManagementHelper'
import { browseMsSupplierFolder } from './steps/browseMsSupplierFolder'
import { getTaskList } from './steps/getTaskList'
import { deleteEndedTasks } from './steps/deleteEndedTasks'

const run = (config: Config, queue: Bull.Queue<any>) => {
  const startTime = new Date()
  queue.process(
    (job: Bull.Job<any>, acknowledge: Bull.DoneCallback): void => {
      Future.of(config.supplierPath)
        .chain(browseMsSupplierFolder)
        .chain(getTaskList(config.fileExporterUri))
        .chain(deleteEndedTasks(config.maxSimultaneousTask))
        .fork(
          Job.failure(acknowledge),
          Job.success(job, acknowledge, startTime)
        )
    }
  )
}

const upsertScheduledMsg = (config: Config) =>
  Future.of(new Queue(config.bullQueueName, config.bullRedisUrl))
    .chain(Job.tryUpsertBullMsg(config.jobFrequency))
    .fork(log, queue => run(config, queue))

export const validateConfig = () =>
  tryBuildConfig(process.env).fold(log, upsertScheduledMsg)
