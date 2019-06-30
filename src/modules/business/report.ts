import { log } from '../generics/utlis'
import { List } from 'monet'
import { map, head, split, prop, reduceBy } from 'ramda'

import { JobReport, NasView, SpotOperation, NasFamilies } from './types'

// const toPcmOp =

// export const addPcmOp = (x: JobReport) => (pcmResp: {}): JobReport => {
//   return {
//     ...x,
//     pcmOp: toPcmOp(pcmResp)
//   }
// }

export const addNasViews = (x: JobReport) => (
  nasViews: NasView[]
): JobReport => {
  return {
    ...x,
    nasViews
  }
}

export const addNasFamilies = (x: JobReport) => (
  nasFamilies: NasFamilies
): JobReport => {
  return {
    ...x,
    nasFamilies
  }
}

export const createFromSpotOp = (spotOp: SpotOperation): JobReport => {
  return {
    spotOp
  }
}
