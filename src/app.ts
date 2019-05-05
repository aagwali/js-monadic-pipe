import { Config } from './types'
import Queue from 'bull'
import Bull from 'bull'
import { Future, bimap } from 'fluture'
import { tryBuildConfig, log } from './utils'
import * as Job from './jobsManagementHelper'
import { browseMsSupplierFolder } from './steps/browseMsSupplierFolder'
import { getBatches } from './steps/getBatches'
import { buildDeletionTask, executeDeletionTask } from './steps/deleteAssets'

const run = (κ: Config, queue: Bull.Queue<any>, startTime: Date) =>
  queue.process(
    (job: Bull.Job<any>, acknowledge: Bull.DoneCallback): void => {
      Future.of(κ.supplierPath)
        .chain(browseMsSupplierFolder)
        .chain(getBatches(κ.fileExporterUri))
        .map(buildDeletionTask)
        .chain(executeDeletionTask(κ.maxSimultaneousTasks))
        .fork(
          Job.failure(acknowledge),
          Job.success(job, acknowledge, startTime)
        )
    }
  )

const upsertScheduledMsg = (κ: Config) =>
  Future.of(new Queue(κ.bullQueueName, κ.bullRedisUrl))
    .chain(Job.tryUpsertBullMsg(κ.jobFrequency))
    .fork(log, queue => run(κ, queue, new Date()))

export const validateConfig = () =>
  tryBuildConfig(process.env).fold(log, upsertScheduledMsg)
