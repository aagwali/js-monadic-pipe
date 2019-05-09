import { Config } from './types'
import Queue from 'bull'
import Bull from 'bull'
import { futureOfValue as futurV } from 'ts-functors'
import { log } from './utils'
import { tryBuildConfig } from './steps/buildConfig'
import * as Job from './jobsManagementHelper'
import { browseSupplierDirectory } from './steps/browseSupplierDirectory'
import { getFileExporterBatches } from './steps/getBatches'
import { buildDeletionTask, executeDeletionTask } from './steps/deleteAssets'
import { ErrorLocation as at, AppError } from './errors'

const run = (k: Config, queue: Bull.Queue<any>, startTime: Date) =>
  queue.process(
    (job: Bull.Job<any>, acknowledge: Bull.DoneCallback): void => {
      futurV(k.supplierPath)
        .bimap(log, log)
        .chain(browseSupplierDirectory)
        .chain(getFileExporterBatches(k.fileExporterUri))
        .map(buildDeletionTask)
        .chain(executeDeletionTask(k.maxSimultaneousTasks))
        .bimap(log, log)
        .fork(
          Job.failure((x: AppError) => acknowledge(x)),
          Job.success(job, acknowledge, startTime)
        )
    }
  )

const upsertScheduledMsg = (k: Config) =>
  futurV(new Queue(k.bullQueueName, k.bullRedisUrl))
    .chain(Job.tryUpsertBullMsg(k.jobFrequency))
    .fork(log, queue => run(k, queue, new Date()))

export const validateConfig = () =>
  tryBuildConfig(process.env).fork(log, upsertScheduledMsg)
