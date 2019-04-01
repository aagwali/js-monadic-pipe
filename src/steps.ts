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
    resolveDefault,
    log,
} from "./monadic-api";
import fs from "fs";
import {
    InitialInput,
    InitialPayload,
    AppError,
    ErrorLocations as errAt,
    FileSystemResult,
    FilePath,
    ReadFileResult,

} from "./types";
import { Future, FutureInstance as AsyncEither, ap } from "fluture";

export const readLine = line => pipe(split("\n"), nth(line));

export const tryFindInArray = <T>(search: T) => (input: T[]
): AsyncEither<AppError, T> =>
    ifUndefined(errAt.TRY_FIND_IN_ARRAY, search)(find(equals(search)))(input);

export const asyncReaddir = (folderpath: InitialPayload
): AsyncEither<AppError, FileSystemResult> =>
    awaitResolution(fs.readdir)([])(folderpath);

export const tryMakeFilePath = (folderContent: FileSystemResult
): AsyncEither<AppError, FilePath> =>
    Future.of(folderContent)
        .chain(tryFindInArray("monadic-api.ts")).chainRej(resolveDefault("fallback.ts"))
        .map(concat("./src/"))
        .mapRej((x: AppError) => x)

export const asyncReadFile = (filePath: FilePath
): AsyncEither<AppError, FileSystemResult> =>
    awaitResolution(fs.readFile)(["utf8"])(filePath);

export const tryReadLine = (line: number) => (input: FileSystemResult
): AsyncEither<AppError, ReadFileResult> =>
    ifUndefined(errAt.TRY_READ_LINE, line)(readLine(line))(input);

export const readFileSystem = (payload: InitialPayload
): AsyncEither<AppError, ReadFileResult> =>
    Future.of(payload)
        .map(replace("valid mock", "./src"))
        .chain(asyncReaddir)
        .chain(tryMakeFilePath)
        .chain(asyncReadFile)
        .chain(tryReadLine(0))
        .mapRej((x: AppError) => x)

export const tryFindPath = (route: Array<string | number>) => (input: InitialInput
): AsyncEither<AppError, InitialPayload> =>
    ifUndefined(errAt.TRY_FIND_PATH, route)(path(route))(input)