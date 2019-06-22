import * as Config from './modules/config'
import { futureOfValue as futurV, log, logx, FutureInstance } from 'ts-functors'
import { buildConfig } from './modules/config'
import * as MsBuffer from './modules/mediashareBuffer'
import * as FileExporter from './modules/fileExporter'
import * as Deletion from './modules/deletion'

const run = (startTime: Date) => (k: Config.Config) =>
  MsBuffer.browseDirectories(k.rawshootPath)
    .map(FileExporter.buildPayload)
    .chain(FileExporter.getBatches(k.fileExporterUri))
    .map(Deletion.buildTask)
    .chain(Deletion.executeTask(k.maxSimultaneousTasks))

export const main = () =>
  buildConfig(Config.mapping, process.env)
    .chain(run(new Date()))
    .fork(log, log)
