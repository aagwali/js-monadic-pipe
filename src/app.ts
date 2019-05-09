import { Config } from './types'
import Queue from 'bull'
import Bull from 'bull'
import { Future, bimap } from 'fluture'
import { tryBuildConfig, log } from './utils'
import * as Job from './jobsManagementHelper'
import { browseMsSupplierFolder } from './steps/browseMsSupplierFolder'
import { getBatches } from './steps/getBatches'
import { buildDeletionTask, executeDeletionTask } from './steps/deleteAssets'
import {
  futureFromNodeback as futurN,
  futureFromPromise as futurP
} from 'ts-functors'
import fs from 'fs'
import { AppError, ErrorLocation as step } from './errors'
import { postHttp } from './apiHelper'
import R from 'ramda'

const run = (k: Config, queue: Bull.Queue<any>, startTime: Date) =>
  queue.process(
    (job: Bull.Job<any>, acknowledge: Bull.DoneCallback): void => {
      Future.of(k.supplierPath)
        .chain(browseMsSupplierFolder)
        .chain(getBatches(k.fileExporterUri))
        .bimap(log, log)
        .map(buildDeletionTask)
        .chain(executeDeletionTask(k.maxSimultaneousTasks))
        .fork(
          Job.failure(acknowledge),
          Job.success(job, acknowledge, startTime)
        )
    }
  )

const upsertScheduledMsg = (k: Config) =>
  Future.of(new Queue(k.bullQueueName, k.bullRedisUrl))
    .chain(Job.tryUpsertBullMsg(k.jobFrequency))
    .fork(log, queue => run(k, queue, new Date()))

export const validateConfig = () =>
  tryBuildConfig(process.env).fold(log, upsertScheduledMsg)
