import Bull from 'bull'
import { FutureInstance as AsyncEither } from 'fluture'
import { AppError, ErrorLocation as at } from './errors'
import {
  formatError as throwFuturErr,
  futureOfValue as futurV,
  futureFromPromise as futurP
} from 'ts-functors'
import { log } from './utils'

export const createRepeatableMsg = (jobFrequency: string) => (
  queue: Bull.Queue<any>
): Promise<Bull.Job<any>> =>
  queue.add(
    { repeatableJob: `Generating message every ${Number(jobFrequency)} ms` },
    {
      repeat: {
        every: Number(jobFrequency)
      }
    }
  )

export const tryUpsertBullMsg = (jobFrequency: string) => (
  queue: Bull.Queue<any>
): AsyncEither<AppError, boolean> =>
  futurV(queue)
    .bimap(log, log)
    .chain(futurP(createRepeatableMsg(jobFrequency)))
    .bimap(log, log)
    .mapRej((e: any) => throwFuturErr(at.TryUpsertBullMsg)(e))
    .bimap(log, log)
    .map(_ => queue)

// ifPromiseRejects(errAt.TRY_UPSERT_BULL_MSG)(createRepeatableMsg(jobFrequency))(
//   queue
// ).map(_ => queue)

export const success = (
  job: Bull.Job<any>,
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
