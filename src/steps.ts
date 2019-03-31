import { path, map, pipe, replace, filter, equals, head, chain, split, concat, nth, applyTo } from 'ramda'
import {
    futureFromMaybe as rejectIf,
    // futureFromCallback as resolveAsync, 
    log, logF
} from './monads-utils'
import fs from 'fs'
import Future from 'fluture';


export const test1 = x => Future.of(x)

export const test2 = x => {

    console.log(x)

    return Future.of(x)
}



///////////////

// const readdirAsync = resolveAsync(fs.readdir)

// const readFileAsync = resolveAsync(fs.readFile, 'utf8')

// const makeFilePath = pipe(
//     filter(equals('monads-utils.js')),
//     head,
//     concat('./src/')
// )

// const readLine = line =>
//     pipe(
//         split('\n'),
//         nth(line)
//     )

// export const tryReadLine = x => rejectIf(`Line does not exists : ${x}`)(readLine(x))

// export const readLineAsync = x => rejectIf(`Line does not exists : ${x}`)(readLine(x))

// export const tryPath = x => rejectIf(`Cannot find path : ${x}`)(path(x))

// const transformInto = replace('valid mock folder name')

// export const readFs = pipe(
//     transformInto('./src'),
    // readdirAsync,
    // map(makeFilePath),
    // chain(readFileAsync),
    // chain(readLineAsync(1))
// )
