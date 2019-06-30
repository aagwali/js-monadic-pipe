import { log } from '../generics/utlis'
import { encaseP2, FutureInstance } from 'fluture'
import {
  AppError,
  formatError,
  standardError as stdErr,
  AppFailure as at
} from '../generics/errors'
import { Config } from '../generics/config'
import { JobReport } from './types'
import * as Report from './report'
import { get as getHttp, basicAuthHeaders } from '../generics/http'

const authId = 'svc_mediatasks'
const authPass = "pWNZO'9.XRwF"
const operationRoute = 'api/v1/operations'

export const getTargetDatas = (conf: Config) => (
  job: JobReport
): FutureInstance<AppError, any> =>
  encaseP2(getHttp, `${conf.pcmUri}/${operationRoute}/${job.spotOp.label}`, {
    headers: basicAuthHeaders(authId, authPass)
  }).bimap(formatError(stdErr, at.GetPcmOpInfos), x => x)
