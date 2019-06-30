import { log } from '../generics/utlis'
import { JobReport, NasView, NasFamilies } from './types'
import {
  formatError,
  AppFailure as at,
  standardError,
  AppError
} from '../generics/errors'
import { node } from 'fluture'
import fs from 'fs'
import { split, head, map, reduceBy, prop, equals } from 'ramda'
import { List } from 'monet'
import * as Report from '../business/report'
import { FutureInstance } from 'fluture'

const calculateDigest = (fileName: string): string => 'not implemented'
const extractMeta = (fileName: string): string => 'not implemented'

const toNasView = (fileName: string): NasView => {
  return {
    filePath: fileName,
    digest: calculateDigest(fileName),
    meta: extractMeta(fileName)
  }
}

const trimFamily = x => head(split('_', x))

const grpByFamily = (fileNames: string[]) =>
  reduceBy((acc, y) => [...acc, y], [], trimFamily)(fileNames)

const writeNasFamilies = (jobReport: JobReport): JobReport =>
  Report.addNasFamilies(jobReport)(
    grpByFamily(jobReport.nasViews.map(prop('filePath')))
  )

const excludeThumbs = (fileNames: string[]) =>
  List.fromArray(fileNames)
    .filterNot(equals('Thumbs.db'))
    .toArray()

const mockPath = '/home/agwali/data/temp/valrhona50/DET'

const writeNasViews = (
  jobReport: JobReport
): FutureInstance<AppError, JobReport> =>
  node(cb => fs.readdir(mockPath, cb))
    .map(excludeThumbs)
    .map(map(toNasView))
    .bimap(
      formatError(standardError, at.ReadNasDetPath),
      Report.addNasViews(jobReport)
    )

export const getTargetDatas = (
  jobReport: JobReport
): FutureInstance<AppError, JobReport> =>
  writeNasViews(jobReport).map(writeNasFamilies)
