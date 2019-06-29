import { encaseP2, FutureInstance } from 'fluture'
import { Config } from '../generics/config'
import { truthyOrRej } from '../generics/utlis'
import { UserSettings, SpotOperation } from './types'
import {
  AppFailure as at,
  AppError,
  formatError,
  joiError
} from '../generics/errors'
import { prop, gt } from 'ramda'
import { get as getHttp } from '../generics/http'

const castOperation = (payload: any): SpotOperation => {
  return {
    label: payload.jeverrai,
    date: 2
  }
}

const fetchOperationData = (
  spotUri: string,
  opLabel: string
): FutureInstance<AppError, SpotOperation> =>
  encaseP2(getHttp, `${spotUri}/operationdetail/${opLabel}/1`, {}).bimap(
    formatError(joiError, at.GetSpotOpInfos),
    castOperation
  )

export const isClosed = (x: SpotOperation): boolean => gt(1, prop('date', x))

export const getDetPath = (spotUri: string) => (
  x: SpotOperation
): FutureInstance<AppError, SpotOperation> =>
  encaseP2(getHttp, spotUri, {}).bimap(
    formatError(joiError, at.GetDetPath),
    castOperation
  )

export const getOperationInfos = ({ spotUri }: Config) => (
  settings: UserSettings
): FutureInstance<AppError, SpotOperation> =>
  fetchOperationData(spotUri, settings.target)
    .chain(truthyOrRej(isClosed, at.CheckOpenDate))
    .chain(getDetPath(spotUri))
