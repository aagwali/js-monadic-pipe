import { log } from '../generics/utlis'
import { encaseP3, FutureInstance } from 'fluture'
import { Config } from '../generics/config'
import {
  post as postHttp,
  get as getHttp,
  basicAuthHeaders
} from '../generics/http'
import { launchProcess } from '../generics/concurrency'

const authId = 'oredis-vp/aagwali'
const authPass = 'aavdaavd55.'
const opRoute = 'api/v1/operations'
const tasksRoute = 'api/v1/tasks'
const indexOpts = 'index/VALID?masterMode='

const headers = () => {
  return { headers: basicAuthHeaders(authId, authPass) }
}

const getMasterMode = uri => op =>
  encaseP3(getHttp, `${uri}/${tasksRoute}/${op}`, headers(), []).map(
    tsk => tsk[0].master_mode
  )

const launchIndexation = uri => op => mMode =>
  encaseP3(
    postHttp,
    `${uri}/${opRoute}/${op}/${indexOpts}${mMode}`,
    '',
    headers()
  )

const callIndexRoute = uri => op =>
  getMasterMode(uri)(op)
    .chain(launchIndexation(uri)(op))
    .promise()

export const launchIndex = (opList: string[]): any => ({ pcmUri }: Config) =>
  encaseP3(launchProcess, callIndexRoute(pcmUri), 3, opList)
