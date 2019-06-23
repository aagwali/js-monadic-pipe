import { log } from '../generics/utlis'

export const checkExistence = (conf: any) => (args: any): any => {
  // is opened ? < KO sauf index
  // in spot ? < KO
  // in PCM ?  < index first
  return undefined
}

export const writePcm = (conf: any) => (args: any): any => {
  // pvs & families in db
  // set status checked pcm + date
  return undefined
}

export const writeDam = (conf: any) => (args: any): any => {
  // call by pv uid  => famId_num/pvId/pimId/digest
  // approuved ?
  //
  return undefined
}

export const writeNas = (conf: any) => (args: any): any => {
  // find path by spot
  // list all existing family/length // + digest
  return undefined
}

export const writePim = (conf: any) => (args: any): any => {
  // tuple family/artId
  return undefined
}

export const writeSpotRelations = (conf: any) => (args: any): any => {
  // tuple source/target
  // save altered state ? = history
  return undefined
}

export const generate = (conf: any) => (args: any): any => {
  // read all data to store integrity status + error list
  // integrity errors are typed individual units
  return undefined
}

export const repairErrors = (conf: any) => (args: any): any => {
  // run scripts to fiw integrity errors
  // can target specific errors
  return undefined
}

export const statusExtract = (x: any): any => log(x)
// return a friendly report of integrity status & errors
