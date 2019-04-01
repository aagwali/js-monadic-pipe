import {
    path,
    pipe,
    replace,
    find,
    equals,
    split,
    concat,
    nth,
    always as id
} from "ramda";


import {
    futureFromMaybe as ifUndefined,
    futureFromNodeback as awaitResolution,
    log,
} from "./monads-utils";
import fs from "fs";
import {
    InitialInput,
    InitialPayload,
    AppError,
    ErrorMessages as ErrMsg,
    ErrorTypes as ErrTyp,
    FileSystemResult,
    FilePath,
    ReadFileResult,

} from "./types";
import { Future, FutureInstance as AsyncEither, ap } from "fluture";

export const readLine = line => pipe(split("\n"), nth(line));

export const arrayTryFind = <T>(search: T) => (input: T[]
): AsyncEither<AppError, T> =>
    ifUndefined(ErrMsg.FIND_ENTRY_FAILURE, search)(find(equals(search)))(input);

export const asyncReaddir = (folderpath: InitialPayload
): AsyncEither<AppError, FileSystemResult> =>
    awaitResolution(fs.readdir)([])(folderpath);

export const tryMakeFilePath = (folderContent: FileSystemResult
): AsyncEither<AppError, FilePath> =>
    Future.of(folderContent)
        .chain(arrayTryFind("monads-utils.ts"))
        .map(concat("./src/"))
        .mapRej((x: AppError) => x)

export const asyncReadFile = (filePath: FilePath
): AsyncEither<AppError, FileSystemResult> =>
    awaitResolution(fs.readFile)(["utf8"])(filePath);

export const tryReadLine = (line: number) => (input: FileSystemResult
): AsyncEither<AppError, ReadFileResult> =>
    ifUndefined(ErrMsg.FIND_ENTRY_FAILURE, line)(readLine(line))(input);

export const readFileSystem = (payload: InitialPayload
): AsyncEither<AppError, ReadFileResult> =>
    Future.of(payload)
        .map(replace("valid mock", "./src"))
        .chain(asyncReaddir)
        .chain(tryMakeFilePath)
        .chain(asyncReadFile)
        .chain(tryReadLine(41))
        .mapRej((x: AppError) => x)

export const tryFindPath = (route: Array<string | number>) => (input: InitialInput
): AsyncEither<AppError, InitialPayload> =>
    ifUndefined(ErrMsg.PARSE_ROUTE_FAILURE, route)(path(route))(input);