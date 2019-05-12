import * as Config from './modules/config'
import Bull from 'bull'
import { futureOfValue as futurV, log, logx, FutureInstance } from 'ts-functors'
import { buildConfig } from './modules/config'
import * as BullManagment from './modules/bull'
import * as MsBuffer from './modules/mediashareBuffer'
import * as FileExporter from './modules/fileExporter'
import * as Deletion from './modules/deletion'
import { AppError, offline } from './modules/errors'
import { apply, always } from 'ramda'
import { map } from 'fluture'

const run = (startTime: Date) => (k: Config.Config) =>
  // const run = (startTime: Date) => (k: Config.Config, queue: Bull.Queue<any>) =>
  // queue.process(
  // (job: Bull.Job<any>, acknowledge: Bull.DoneCallback): void => {
  MsBuffer.browseDirectories(k.rawshootPath)
    .map(FileExporter.buildPayload)
    .chain(FileExporter.getBatches(k.fileExporterUri))
    .map(Deletion.buildTask)
    .chain(Deletion.executeTask(k.maxSimultaneousTasks))
// .fork(

// }
// )

// export const main = () =>
//   buildConfig(Config.mapping, process.env)
//     .chain(BullManagment.upsertScheduledMsg)
//     .fork(log, apply(run(new Date())))

export const main = () =>
  buildConfig(Config.mapping, process.env)
    // .chain(BullManagment.upsertScheduledMsg)
    // .fork(log, run(new Date()))
    .chain(run(new Date()))
    .fork(log, log)
