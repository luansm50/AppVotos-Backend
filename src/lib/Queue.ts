import Queue from 'bull';
import { B } from 'pattern-matching-js';
import redisConfig from '../config/Redis';

import * as jobs from '../jobs'
const queues: any[] = Object.values(jobs).map(job => ({
    bull: new Queue(job.key, redisConfig),
    name: job.key,
    handle: job.handle
}))

export default {
    queues,
    add(name: String, data: any) {
        const queue = this.queues.find(queue => queue.name === name);
        return queue.bull.add(data, queue.options);
    },
    process() {
        return this.queues.forEach(queue => {
            queue.bull.process(queue.handle);

            queue.bull.on('failed', () => {

            })
            queue.bull.on('failed', async (job: any, err: any) => {
                console.log('Job failed', queue.bull.name, job);
                console.log(err);
                switch (err) {
                    case "WAIT":
                        var data = job.data;
                        data.retries = data.retries ? ++data.retries : 1;
                        job.update(data)
                        await delay(5000).then(() => job.retry());
                        // job.retry();
                        break;
                    case "FAILED":
                        var data = job.data;
                        data.retries = data.retries ? ++data.retries : 1;
                        job.delay = 20;
                        job.update(data)
                        job.moveToCompleted();
                        break;
                }
            })

            queue.bull.on('deleyed', (job: any, err: any) => {
                console.log('Job ok', queue.key, job.data);
                console.log(err);
            })
        })


    }
}

function delay(t: number) {
    return new Promise(resolve => {
        setTimeout(resolve, t);
    });
}
