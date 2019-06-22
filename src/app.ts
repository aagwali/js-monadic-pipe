import * as Config from './modules/generics/config'
import { futureOfValue as futurV, log, logx, FutureInstance } from 'ts-functors'
import { buildConfig } from './modules/generics/config'
import * as MsBuffer from './modules/business/mediashareBuffer'
import * as FileExporter from './modules/business/fileExporter'
import * as Deletion from './modules/business/deletion'

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
