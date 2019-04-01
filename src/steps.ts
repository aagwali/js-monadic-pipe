import {
    path,
    pipe,
    replace,
    find,
    equals,
    split,
    concat,
    nth
} from "ramda";


import {
    futureFromMaybe as ifUndefined,
    futureFromNodeback as awaitResolution,
    log,
} from "./monads-utils";
import fs from "fs";
import {
    AppError,
    ErrorMessages as ErrMsg
} from "./types";
import { Future, FutureInstance } from "fluture";

export const readLine = line => pipe(split("\n"), nth(line));

export const transformInto = replace("valid mock folder name");

export const tryPath = (route: Array<string | number>) => (input: any
): FutureInstance<AppError, any> =>
    ifUndefined(ErrMsg.PARSE_ROUTE_FAILURE, route)(path(route))(input);

export const tryFind = (search: any) => (input: Array<any>
): FutureInstance<AppError, any> =>
    ifUndefined(ErrMsg.FIND_ENTRY_FAILURE, search)(find(equals(search)))(input);

export const tryReadLine = (line: number) => (input: Array<any>
): FutureInstance<AppError, any> =>
    ifUndefined(ErrMsg.FIND_ENTRY_FAILURE, line)(readLine(line))(input);

export const asyncReadFile = (fileName: string
): FutureInstance<AppError, any> =>
    awaitResolution(fs.readFile)(["utf8"])(fileName);

export const asyncReaddir = (folderpath: string
): FutureInstance<AppError, any> =>
    awaitResolution(fs.readdir)([])(folderpath);

export const tryMakeFilePath = (folderContent: string[]
): FutureInstance<any, any> =>
    Future.of(folderContent)
        .chain(tryFind("monads-utils.ts"))
        .map(concat("./src/"));

export const readFs = (contentInput: string): FutureInstance<any, any> =>
    Future.of(contentInput)
        .map(transformInto("./src"))
        .chain(asyncReaddir)
        .chain(tryMakeFilePath)
        .chain(asyncReadFile)
        .chain(tryReadLine(1));
