import {
    path,
    __,
    pipe,
    find,
    equals,
    split,
    concat,
    nth,
    always as id
} from "ramda";
import { AppError, ErrorLocations as errAt } from "./errors"
import { log } from "./utils";
import {
    futureFromMaybe as ifUndefined,
    futureFromNodeback as awaitResolution,
    resolveDefault,
} from "./monadic-api";
import fs from "fs";
import {
    InitialInput,
    Config,

} from "./types";
import { Future, FutureInstance as AsyncEither, ap } from "fluture";

export const readLine = line => pipe(split("\n"), nth(line));

export const tryFindInArray = <T>(search: T) => (input: T[]
): AsyncEither<AppError, T> =>
    ifUndefined(errAt.TRY_FIND_IN_ARRAY, search)(find(equals(search)))(input);

export const asyncReaddir = (folderpath: string
): AsyncEither<AppError, string[]> =>
    awaitResolution(fs.readdir)([])(folderpath);

export const tryMakeFilePath = ({ fileName, fileName_fallback }: Config) => (folderContent: string[]
): AsyncEither<AppError, string> =>
    Future.of(folderContent)
        .chain(tryFindInArray(fileName)).chainRej(resolveDefault(fileName_fallback))
        .map(concat(`./src/`))
        .mapRej((x: AppError) => x)

export const asyncReadFile = (filePath: string
): AsyncEither<AppError, string[]> =>
    awaitResolution(fs.readFile)(["utf8"])(filePath);

export const tryReadLine = (line: number) => (input: string[]
): AsyncEither<AppError, string> =>
    ifUndefined(errAt.TRY_READ_LINE, line)(readLine(line))(input);

export const readFileSystem = (config: Config) => (payload: string
): AsyncEither<AppError, string> =>
    Future.of(payload)
        .map(concat("./"))
        .chain(asyncReaddir)
        .chain(tryMakeFilePath(config))
        .chain(asyncReadFile)
        .chain(tryReadLine(Number(config.fileLine)))
        .mapRej((x: AppError) => x)

export const tryFindPath = (route: Array<string | number>) => (input: InitialInput
): AsyncEither<AppError, string> =>
    ifUndefined(errAt.TRY_FIND_PATH, route)(path(route))(input)