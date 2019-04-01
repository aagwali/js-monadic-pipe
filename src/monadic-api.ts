/* ٭ ★ This is a clEAN WAy to ride A pipe ★ ٭ */
import { Maybe, Either } from "monet";
import { Future, node, FutureInstance, Nodeback } from "fluture";
import R from "ramda";
import {
  AppError,
  ErrorLocations,
  buildError,
  getErrorLocation
} from "./types";

export const log = R.tap(console.log);

export const resolveDefault = <T>(defaultVal: T) => R.always(Future.of(defaultVal))

export const futureFromMaybe = (errAt: ErrorLocations, details: any) => (fun: any) => (
  arg: any
): FutureInstance<AppError, any> =>
  Maybe.fromUndefined(fun(arg)).fold
    (Future.reject(buildError(errAt, details)))
    (Future.of);

export const futureFromNodeback = (fun: Nodeback<any, any>) => (optArgs: any[]) => (
  mainArg: any
): FutureInstance<AppError, any> =>
  node(done => fun(mainArg, ...optArgs, done))
    .mapRej(err => buildError(getErrorLocation(fun.name), err))
