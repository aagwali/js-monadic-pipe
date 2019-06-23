import { tap } from 'ramda'
import { encaseP2, FutureInstance } from 'fluture'
import ora from 'ora'
export const log = tap(console.log)

export const encaseLoader = (fun: any): FutureInstance<any, any> => {
  const spinner = ora('Processing...').start()
  return fun.map(x => {
    spinner.stop()
    return x
  })
}
