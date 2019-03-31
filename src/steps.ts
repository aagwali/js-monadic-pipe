import { path, map, pipe, replace, find, equals, head, chain, split, concat, nth, applyTo } from 'ramda'
import {
    futureFromMaybe as rejectUndefined,
    futureFromNodeback as resolveAsync,
    log, logF
} from './monads-utils'
import fs from 'fs'
import Future from 'fluture';
import { NEL } from 'monet'


export const tryPath = x => rejectUndefined(`Cannot find path : ${x}`)(path(x))

export const tryFind = x => rejectUndefined(`Cannot find file : ${x}`)(find(equals(x)))

const readLine = line => pipe(
    split('\n'),
    nth(line))

export const tryReadLine = x => rejectUndefined(`Line does not exists : ${x}`)(readLine(x))

const tryMakeFilePath = x =>
    Future.of(x)
        .chain(tryFind('monads-utils.ts'))
        .map(concat('./src/'))

const asyncReadFile = resolveAsync(fs.readFile, 'utf8')

const asyncReaddir = resolveAsync(fs.readdir)

const transformInto = replace('valid mock folder name')

export const readFs = x =>
    Future.of(x)
        .map(transformInto('./src'))
        .chain(asyncReaddir)
        .chain(tryMakeFilePath)
        .chain(asyncReadFile)
        .chain(tryReadLine(1))
