//#region Imports
import { path, map, pipe, replace, filter, equals, head, chain, split, concat, nth } from 'ramda'
import * as M from './monads-utils'
import fs from 'fs'
//#endregion

const transformContent = replace('anythingUseful', './src')

const readdirAsync = M.futureFromCallback(fs.readdir)

const readFileAsync = M.futureFromCallback(fs.readFile, 'utf8')

const makeFilePath = filter(equals('monads-utils.js')) & head & concat('./src/') // head is failable cf.15

const readLine = line => file => file |> split('\n') & nth(line)

export const tryParseContent = M.futureFromMaybe('Content key is missing')(path(['content']))

export const tryReadLine = x => M.futureFromMaybe('Selected line does not exists')(readLine(x))

export const readUtilsFile = pipe(
    transformContent,
    readdirAsync,
    map(makeFilePath),
    chain(readFileAsync),
    chain(tryReadLine(15))
)
