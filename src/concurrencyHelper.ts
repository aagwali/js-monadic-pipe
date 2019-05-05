type ProcessorCallback<T> = (task: T) => Promise<T>

type Consumer<T> = {
  consume: (task: T, cb: ProcessorCallback<T>) => Promise<T>
}

// doublon link with app bad

type Producer<T> = {
  nextTaskIndex: number
  queue: T[]
  produce: () => T
  results: Error[]
}

const producer: Producer<any> = {
  nextTaskIndex: 0,
  queue: [],
  produce: () => producer.queue[producer.nextTaskIndex++],
  results: []
}

const buildError = (err: any): Error => {
  if (err instanceof Error) {
    return err
  } else {
    const systErr = new Error(err)
    systErr.message = err
    return systErr
  }
}

const consumer: Consumer<any> = {
  consume: (task, cb) => {
    if (task === undefined) return
    return new Promise(resolve => {
      cb(task)
        .then(() => resolve(consumer.consume(producer.produce(), cb)))
        .catch(err => {
          producer.results.push(buildError(err))
          return resolve(consumer.consume(producer.produce(), cb))
        })
    })
  }
}

export const launchProcess = <T>(
  processor: ProcessorCallback<T>,
  concurency: number,
  tasks: T[]
): Promise<Error[]> => {
  producer.queue = tasks
  producer.nextTaskIndex = 0
  producer.results = []
  const consumersBuilder = new Array(concurency).fill(consumer)
  return Promise.all(
    consumersBuilder.map(() => consumer.consume(producer.produce(), processor))
  ).then(() => producer.results)
}
// is err list safe ?
