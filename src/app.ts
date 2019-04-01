import { log } from "./monadic-api";
import { readFileSystem, tryFindPath } from "./steps";
import { InitialInput, ReadFileResult, AppSuccess } from "./types";
import Future from "fluture";

const input: InitialInput = { content: "valid mock" };

const start = Future.of(input)
    .chain(tryFindPath(["content"]))
    .chain(readFileSystem)
    .map((x: ReadFileResult): AppSuccess => new AppSuccess(x))
    .fork(log, log);
