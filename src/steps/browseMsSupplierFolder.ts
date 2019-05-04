import fs from 'fs'
import { FutureInstance as AsyncEither } from 'fluture'
import { AppError, ErrorLocations as errAt } from '../errors'
import { futureFromNodeback as ifNodebackRejects } from '../monadic-api'
import R from 'ramda'

const isDirectory = basePath => result =>
  fs.lstatSync(basePath + '/' + result).isDirectory()

export const browseMsSupplierFolder = (
  folderPath: string
): AsyncEither<AppError, string[]> =>
  ifNodebackRejects(errAt.BROWSE_SUPPLIER_TEMP)(fs.readdir)(folderPath)([]).map(
    α => R.filter(isDirectory(folderPath), α)
  )
