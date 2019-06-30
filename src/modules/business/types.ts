export enum ActionType {
  Check = 'check',
  Repair = 'repair',
  Index = 'index'
}

export enum ReportError {
  MissingFamily = 'missingFamily',
  MissingViews = 'missingViews',
  None = 'none'
}

export type SpotOperation = {
  label: string
  closeDate: string
  detPath?: string
}

export type NasView = {
  filePath: string
  meta: string
  digest: string
}

export type PcmOp = {
  label: string
  masterMode: string
}

export type NasFamilies = {
  [famId: string]: string[]
}

export type JobReport = {
  spotOp: SpotOperation
  nasViews?: NasView[]
  nasFamilies?: NasFamilies
  pcmOp?: PcmOp
}

export type UserSettings = {
  action: ActionType
  target: string
  options: {
    errorFilter: ReportError
  }
}
