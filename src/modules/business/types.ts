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
  date: number
  detPath?: string
}

export type UserSettings = {
  action: ActionType
  target: string
  options: {
    errorFilter: ReportError
  }
}
