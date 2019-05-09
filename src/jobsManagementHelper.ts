import Bull from 'bull'
import { futureFromPromise as ifPromiseRejects } from './monadic-api'
import { FutureInstance as AsyncEither } from 'fluture'
import { AppError, ErrorLocation as errAt } from './errors'

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
): AsyncEither<AppError, any> =>
  ifPromiseRejects(errAt.TRY_UPSERT_BULL_MSG)(
    createRepeatableMsg(jobFrequency)
  )(queue).map(_ => queue)

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

export const failure = (acknowledge: Bull.DoneCallback) => ({
  location,
  type,
  error
}: AppError): void =>
  acknowledge(
    new Error(
      ` Process failed at : ${location};\n Error type : ${type};\n Details : ${error};\n `
    )
  )

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
