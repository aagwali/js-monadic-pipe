//#region Imports
import { path, map, pipe, replace, filter, equals, head, chain, split, concat, nth, applyTo } from 'ramda'
import { futureFromMaybe as rejectIf, futureFromCallback as resolveAsync, log, logF } from './monads-utils'
import fs from 'fs'
//#endregion

export const tryPath = x => rejectIf(`Cannot find path : ${x}`)(path(x))

const transformInto = replace('valid mock folder name')

const readdirAsync = resolveAsync(fs.readdir)

const readFileAsync = resolveAsync(fs.readFile, 'utf8')

const makeFilePath = filter(equals('monads-utils.js')) & head & concat('./src/') // head is failable cf.15

const readLine = line => split('\n') & nth(line)

export const tryReadLine = x => rejectIf(`Line does not exists : ${x}`)(readLine(x))

export const readLineAsync = x => rejectIf(`Line does not exists : ${x}`)(readLine(x))

export const readFs = pipe(
    transformInto('./src'),
    readdirAsync,
    map(makeFilePath),
    chain(readFileAsync),
    chain(readLineAsync(1))
)
