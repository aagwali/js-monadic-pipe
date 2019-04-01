import { Maybe, Either } from "monet";
import { Future, node, FutureInstance } from "fluture";
import R from "ramda";
import {
  AppError,
  ErrorTypes as ErrTyp,
  ErrorMessages as ErrMsg
} from "./types";

export const log = R.tap(console.log);

export const buildError = (x: ErrTyp, y: string, z: {} | string): AppError => {
  return {
    type: x,
    functionName: y,
    details: z
  }
};

export const futureFromMaybe = (failureMsg: ErrMsg, target: any) => (fun: any) => (
  input: any
): FutureInstance<AppError, any> =>
  Maybe.fromUndefined(fun(input)).fold
    (Future.reject(buildError(ErrTyp.DataParsing, fun.name, `${failureMsg} "${target}"`)))
    (Future.of);

export const futureFromNodeback = (fun: any) => (optArgs: any[]) => (
  input: any
): FutureInstance<AppError, any> =>
  node(done => fun(input, ...optArgs, done))
    .mapRej(err => buildError(ErrTyp.Nodeback, fun.name, err));
