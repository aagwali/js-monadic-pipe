import { Maybe, Either } from "monet";
import { Future, node, FutureInstance } from "fluture";
import R from "ramda";
import {
  AppError,
  ErrorTypes as ErrTyp,
  ErrorMessages as ErrMsg
} from "./types";

export const log = R.tap(console.log);

export const futureFromMaybe = (failureMsg: ErrMsg, target: any) => (fun: any) => (
  arg: any
): FutureInstance<AppError, any> =>
  Maybe.fromUndefined(fun(arg)).fold
    (Future.reject(new AppError(ErrTyp.DataParsing, fun.name, `${failureMsg} "${target}"`)))
    (Future.of);

export const futureFromNodeback = (fun: any) => (optArgs: any[]) => (
  mainArg: any
): FutureInstance<AppError, any> =>
  node(done => fun(mainArg, ...optArgs, done))
    .mapRej(err => new AppError(ErrTyp.Nodeback, fun.name, err));
