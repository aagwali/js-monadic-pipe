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

export enum MasterMode {
  NAS = 'NAS',
  DAM = 'DAM',
  DBR = 'DBR'
}

export enum SourceData {
  RerunSales = 'rerunSales',
  PublishedSale = 'publishedSale'
}

export type UserSettings = {
  action: ActionType
  target: string
  options: {
    errorFilter: ReportError
    forceRecheck: Boolean
    indexationOptions?: { masterMode: MasterMode; sourceData: SourceData }
    deprecatePreviousRelation: Boolean
  }
}
