import { encaseP, FutureInstance } from 'fluture'
import { Config } from '../generics/config'
import { truthyOrRej } from '../generics/utlis'
import { UserSettings, SpotOperation, JobReport } from './types'
import {
  AppFailure as at,
  AppError,
  formatError,
  standardError as stdErr
} from '../generics/errors'
import { prop } from 'ramda'
import { get as getHttp } from '../generics/http'
import * as Report from '../business/report'
import { log } from '../generics/utlis'

const opRoute = 'operation'
const opDetailRoute = 'operationdetail'
const siteIdFr = '1'
const detPath = '\\Photos\\3 en ligne\\Classique\\DET'

const toSpotOperation = ([spotResp]: any[]): SpotOperation => {
  return {
    label: spotResp.OperationCode,
    closeDate: spotResp.StopDate
  }
}

const addDetPath = (x: SpotOperation) => (spotResp: any): SpotOperation => {
  return { ...x, detPath: `${spotResp.OperationPath}${detPath}` }
}

const isClosed = (x: SpotOperation): boolean =>
  new Date(prop('closeDate', x)) < new Date(Date.now())

const fetchDetPath = (spotUri: string) => (
  x: SpotOperation
): FutureInstance<AppError, SpotOperation> =>
  encaseP(getHttp, `${spotUri}/${opRoute}/${x.label}`).bimap(
    formatError(stdErr, at.GetOperationPath),
    addDetPath(x)
  )

const fetchOperationData = (
  spotUri: string,
  opLabel: string
): FutureInstance<AppError, SpotOperation> =>
  encaseP(getHttp, `${spotUri}/${opDetailRoute}/${opLabel}/${siteIdFr}`).bimap(
    formatError(stdErr, at.GetSpotOpInfos),
    toSpotOperation
  )

export const getTargetDatas = ({ spotUri }: Config) => (
  settings: UserSettings
): FutureInstance<AppError, JobReport> =>
  fetchOperationData(spotUri, settings.target)
    .chain(truthyOrRej(isClosed, at.CheckStopDate))
    .chain(fetchDetPath(spotUri))
    .map(Report.createFromSpotOp)
