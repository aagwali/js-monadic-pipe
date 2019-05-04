type ProcessorCallback<T> = (task: T) => Promise<T>

type Consumer<T> = {
  consume: (task: T, cb: ProcessorCallback<T>) => Promise<T>
}

type Producer<T> = {
  nextTaskIndex: number
  queue: Array<T>
  produce: () => T
}

const producer: Producer<any> = {
  nextTaskIndex: 0,
  queue: [],
  produce: () => producer.queue[producer.nextTaskIndex++]
}

const consumer: Consumer<any> = {
  consume: (task, cb) => {
    if (task === undefined) return
    return new Promise((resolve, reject) => {
      cb(task)
        .then(() => resolve(consumer.consume(producer.produce(), cb)))
        .catch(err => {
          consumer.consume(producer.produce(), cb).catch(reject)
          return reject(err)
        })
    })
  }
}

export const launchProcess = <T>(
  processor: any,
  tasks: Array<T>,
  concurency: number
) => (acc: any): Array<Promise<T>> => {
  producer.queue = tasks
  producer.nextTaskIndex = 0
  const consumersBuilder = new Array(concurency).fill(consumer)
  return consumersBuilder.map(() =>
    consumer.consume(producer.produce(), processor(acc))
  )
}
