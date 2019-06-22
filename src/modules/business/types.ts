export enum ActionType {
  Check = 'check',
  Repair = 'repair',
  Index = 'index',
  Report = 'report'
}

export enum ScopeTarget {
  VEC = 'VEC',
  PCM = 'PCM',
  BDD = 'BDD'
}

export enum ChunkType {
  DateInterval = 'dateInterval',
  LabelCharBounds = 'labelCharBounds',
  SingleEntry = 'singleEntry'
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
  scope: { target: ScopeTarget; chunkType: ChunkType; chunkValue: any }
  options: {
    errorFilter: ReportError
    forceRecheck: Boolean
    indexationOptions?: { masterMode: MasterMode; sourceData: SourceData }
    PCMreplaceNas: Boolean
    VECnonIndexedReport: Boolean
    deprecatePreviousRelation: Boolean
  }
}
