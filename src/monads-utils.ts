import { Maybe, Either } from "monet";
import { Future, node, FutureInstance } from "fluture";
import R from "ramda";

export const log = R.tap(console.log);
export const logF = R.map(R.tap(console.log));

export const futureFromMaybe = (failureMsg: string) => (funct: any) => (
  input: any
): FutureInstance<string, any> =>
  Maybe.fromUndefined(funct(input)).fold(Future.reject(failureMsg))(Future.of);

export const futureFromNodeback = (...fun_argOpt): any => (
  val: any
): FutureInstance<string, any> =>
  node(done => R.head(fun_argOpt)(val, ...R.tail(fun_argOpt), done));
