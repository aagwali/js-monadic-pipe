import { readFileSystem, tryFindPath } from "./steps";
import { tryBuildConfig, log } from "./utils";
import { InitialInput, AppSuccess, Config } from "./types";
import Future from "fluture";

const input: InitialInput = { folder: "src" };

const start = (config: Config) =>
    Future.of(input)
        .chain(tryFindPath([config.requiredProp]))
        .chain(readFileSystem(config))
        .map(x => new AppSuccess(x))
        .fork(log, log);

export const validateConfig = () => tryBuildConfig(process.env)
    .fold(log, start)