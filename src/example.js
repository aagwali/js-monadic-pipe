//#region Imports
import {
  path,
  map,
  pipe,
  replace,
  filter,
  equals,
  head,
  chain,
  split,
  concat,
  nth
} from 'ramda'
import {
  Maybe,
  Result,
  Future,
  futureFromCallback,
  log,
  logF
} from './monads-utils'
import fs from 'fs'
//#endregion

const parseContent = initialInput =>
  Result.fromMaybe(
    Maybe.fromNullable(path(['content'], initialInput)),
    'Required -content- key is missing on initial input.'
  ).fold(Future.rejected, Future.of)

const fsAccess = pipe(
  replace('anythingUseful', './src'),
  futureFromCallback(fs.readdir),
  map(
    pipe(
      filter(equals('monads-utils.js')),
      head,
      concat('./src/')
    )
  ),
  chain(futureFromCallback(fs.readFile, 'utf8')),
  map(
    pipe(
      split('\n'),
      nth(1)
    )
  )
)

module.exports = { parseContent, fsAccess }
