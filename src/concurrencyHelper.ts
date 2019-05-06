type ProcessorCallback<T> = (task: T) => Promise<T>

type Consumer<T> = {
  consume: (task: T, cb: ProcessorCallback<T>) => Promise<T>
}

type Producer<T> = {
  nextTaskIndex: number
  queue: T[]
  produce: () => T
  results: any[]
}

const producer: Producer<any> = {
  nextTaskIndex: 0,
  queue: [],
  produce: () => producer.queue[producer.nextTaskIndex++],
  results: []
}

const consumer: Consumer<any> = {
  consume: (task, cb) => {
    if (task === undefined) return
    return new Promise(resolve => {
      cb(task)
        .then(() => resolve(consumer.consume(producer.produce(), cb)))
        .catch(err => {
          producer.results.push(err)
          return resolve(consumer.consume(producer.produce(), cb))
        })
    })
  }
}

export const launchProcess = <T>(
  processor: ProcessorCallback<T>,
  concurency: number,
  tasks: T[]
): Promise<any[]> => {
  producer.queue = tasks
  producer.nextTaskIndex = 0
  producer.results = []
  const consumersBuilder = new Array(concurency).fill(consumer)
  return Promise.all(
    consumersBuilder.map(() => consumer.consume(producer.produce(), processor))
  ).then(() => producer.results)
}
// is push err list safe ?
