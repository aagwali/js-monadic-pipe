import { log } from "./monads-utils";
import { tryFindPath, readFileSystem } from "./steps";
import { InitialInput } from "./types";
import Future from "fluture";

const input: InitialInput = { content: "valid mock" };

const start = Future.of(input)
    .chain(tryFindPath(["content"]))
    .chain(readFileSystem)
    .fork(log, log);
