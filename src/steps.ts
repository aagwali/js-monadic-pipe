import { path, pipe, replace, find, equals, split, concat, nth } from "ramda";
import {
    futureFromMaybe as rejectUndefined,
    futureFromNodeback as awaitResolution,
    log,
    logF
} from "./monads-utils";
import fs from "fs";
import { Future, FutureInstance } from "fluture";

export const tryPath = (route: Array<string | number>) => (
    input: any
): FutureInstance<string, any> =>
    rejectUndefined(`Route Parsing failure : ${route}`)(path(route))(input);

export const tryFind = (target: any) => (
    input: Array<any>
): FutureInstance<string, any> =>
    rejectUndefined(`Cannot find file : ${target}`)(find(equals(target)))(input);

export const readLine = line => pipe(split("\n"), nth(line));

export const tryReadLine = (line: number) => (input: Array<any>
): FutureInstance<string, any> =>
    rejectUndefined(`Line does not exists : ${line}`)(readLine(line))(input);

export const tryMakeFilePath = (folderContent: string[]
): FutureInstance<any, any> =>
    Future.of(folderContent)
        .chain(tryFind("monads-utils.ts"))
        .map(concat("./src/"));

export const asyncReadFile = (fileName: string
): FutureInstance<string, any> =>
    awaitResolution(fs.readFile, "utf8")(fileName);

export const asyncReaddir = (folderpath: string
): FutureInstance<string, any> =>
    awaitResolution(fs.readdir)(folderpath);

export const transformInto = replace("valid mock folder name");

export const readFs = (contentInput: string
): FutureInstance<any, any> =>
    Future.of(contentInput)
        .map(transformInto("./src"))
        .chain(asyncReaddir)
        .chain(tryMakeFilePath)
        .chain(asyncReadFile)
        .chain(tryReadLine(1));
