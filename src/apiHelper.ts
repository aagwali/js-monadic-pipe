import R from 'ramda'
import fetch, { Headers } from 'node-fetch'
import { Base64 } from 'js-base64'
import { JSONResponse } from './types'

type BasicFetchPayload = {
  url: string
  method: 'POST' | 'GET'
  config: Object
  extraAcceptedStatus: Array<number>
}

const baseFetch = ({
  url,
  method,
  config,
  extraAcceptedStatus
}: BasicFetchPayload): Promise<any> =>
  new Promise((resolve, reject) => {
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...config
    })
      .then((response: JSONResponse<any>) => {
        if (
          R.contains<number>(Number(response.status), [
            200,
            201,
            ...extraAcceptedStatus
          ])
        ) {
          resolve(response.json())
        } else {
          reject(
            Error(
              `Call to ${url} responded with an error ${response.status}: ${
                response.statusText
              }\n${JSON.stringify(config)}`
            )
          )
        }
      })
      .catch((error: Error) => reject(error))
  })

export const post = (
  url: string,
  body: Object | Array<any> | string | FormData,
  config: Object = {},
  extraAcceptedStatus: Array<number> = []
): Promise<any> =>
  baseFetch({
    url,
    method: 'POST',
    config: { ...config, body },
    extraAcceptedStatus
  })

export const get = (
  url: string,
  config: Object = {},
  extraAcceptedStatus: Array<number> = []
): Promise<any> =>
  baseFetch({
    url,
    method: 'GET',
    config,
    extraAcceptedStatus
  })

export const basicAuthHeaders = (
  username: string,
  password: string
): Headers => {
  const headers: Headers = new Headers()
  const base64Part: string = Base64.encode(username + ':' + password)
  headers.set('Authorization', 'Basic ' + base64Part)
  return headers
}

export const postHttp = uri => payload =>
  post(`${uri}`, JSON.stringify(payload))
