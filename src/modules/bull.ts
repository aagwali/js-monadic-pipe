import { AppError, ErrorLocation as at } from './errors'
import {
  formatError as throwFuturErr,
  futureOfValue as futurV,
  futureFromPromise as futurP,
  FutureInstance as Future,
  log
} from 'ts-functors'
import Bull from 'bull'
import Queue from 'bull'
import { Config } from './config'

type BullQueue = Bull.Queue<any>
type BullJob = Bull.Job<any>

export const createRepeatableMsg = (jobFrequency: string) => (
  queue: BullQueue
): Promise<Bull.Job<any>> =>
  queue.add(
    { repeatableJob: `Generating message every ${Number(jobFrequency)} ms` },
    {
      repeat: {
        every: Number(jobFrequency)
      }
    }
  )

export const upsertScheduledMsg = (
  k: Config
): Future<AppError, [Config, BullQueue]> =>
  futurV(new Queue(k.bullQueueName, k.bullRedisUrl))
    .chain(futurP(createRepeatableMsg(k.jobFrequency)))
    .bimap(
      (e: any) => throwFuturErr(at.UpsertBullMsg)(e),
      ({ queue }: BullJob): BullQueue => [k, queue]
    )

export const success = (
  job: BullJob,
  acknowledge: Bull.DoneCallback,
  startTime: Date
) => (result: any): void => {
  const endTime = new Date()
  job.progress(100).catch(e => console.log(e))
  acknowledge(null, {
    jobEndTime: endTime.toString(),
    jobStartTime: startTime.toString(),
    jobTimeElapsed: (endTime.getTime() - startTime.getTime()) / 1000,
    ...result
  })
}

export const failure = (acknowledge: Bull.DoneCallback) => (xx: any): void =>
  acknowledge(new Error(` Process failed at : ${xx};\n\n `))

// import { BullPublisherQueueShape } from "../types";
// import * as Utils from "../utils";
// import { Ora } from "ora";

// export const progress = (
//   job: Bull.Job<BullPublisherQueueShape>,
//   spinner: Ora
// ) => (value: number): void => {
//   spinner.text = "Processing job ... " + String(value) + " %";
//   job.progress(value).catch(e => Utils.logError(e));
// };
