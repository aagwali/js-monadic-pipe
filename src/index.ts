import { log, logF } from "./monads-utils";
import { tryPath, readFs } from "./steps";
import { InitialInput } from "./types";
import Future from "fluture";

const input: InitialInput = { content: "valid mock folder name" };

const start = Future.of(input)
    .chain(tryPath(["content"]))
    .chain(readFs)
    .fork(log, log);
