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
import * as Monad from './monads-utils'
const Maybe = require('folktale/maybe')
const Result = require('folktale/result')
const Future = require('folktale/concurrency/future')
import fs from 'fs'
//#endregion

export const parseContent = initialInput =>
  Result.fromMaybe(
    Maybe.fromNullable(path(['content'], initialInput)),
    'Required -content- key is missing on initial input.'
  ).fold(Future.rejected, Future.of)

export const fsAccess = pipe(
  replace('anythingUseful', './src'),
  Monad.futureFromCallback(fs.readdir),
  map(
    pipe(
      filter(equals('monads-utils.js')),
      head,
      concat('./src/')
    )
  ),
  chain(Monad.futureFromCallback(fs.readFile, 'utf8')),
  map(
    pipe(
      split('\n'),
      nth(1)
    )
  )
)
