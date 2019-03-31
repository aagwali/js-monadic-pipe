import { pipe, chain } from 'ramda'
import { log, logF } from './monads-utils'
import { tryPath, readFs } from './steps'
import Future from 'fluture';
import { Either } from 'monet'

const input = { content: 'valid mock folder name' }

const start =
    Future.of(input)
        .chain(tryPath(['content']))
        .chain(readFs)
        .fork(log, log)

