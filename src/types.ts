
export type InitialInput = {
  folder: string;
};

export type Config = {
  fileName: string;
  fileName_fallback: string;
  requiredProp: string;
  fileLine: string;
};

export const configEnvMapping: Config = {
  requiredProp: "REQUIRED_PROP",
  fileName: "FILE_NAME",
  fileName_fallback: "FILE_NAME_FALLBACK",
  fileLine: "FILE_LINE",
}

export const buildConfig = (env: any): Config => {
  return {
    fileName: env.FILE_NAME,
    fileName_fallback: env.FILE_NAME_FALLBACK,
    requiredProp: env.REQUIRED_PROP,
    fileLine: env.FILE_LINE,
  }
}

export class AppSuccess {
  result: string
  constructor(success: string) {
    this.result = success;
  }
}




