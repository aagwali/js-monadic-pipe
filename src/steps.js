//#region Imports
import { path, map, pipe, replace, filter, equals, head, chain, split, concat, nth } from 'ramda'
import { futureFromMaybe as rejectIf, futureFromCallback as resolveAsync, log, logF } from './monads-utils'
import fs from 'fs'
//#endregion

const transformInto = replace('valid mock folder name')

const readLine = line => split('\n') & nth(line)

const readdirAsync = resolveAsync(fs.readdir)

const readFileAsync = resolveAsync(fs.readFile, 'utf8')

export const tryPath = x => rejectIf(`Cannot find path : ${x}`)(path(x))

export const tryReadLine = x => rejectIf(`Line does not exists : ${x}`)(readLine(x))

const makeFilePath = filter(equals('monads-utils.js')) & head & concat('./src/') // head is failable cf.15

export const readFs = pipe(
    transformInto('./src'),
    readdirAsync,
    map(makeFilePath),
    chain(readFileAsync),
    chain(tryReadLine(11))
)
