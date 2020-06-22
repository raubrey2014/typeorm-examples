import { Task } from '../entity/Task'

/**
 * This example exhibits the capabilities of:
 * 1. Column length attribute
 *
 */
export default async (): Promise<void> => {
    const task = new Task()
    task.description =
        'A very long description indeed. A very long description indeed. A very long description indeed. A very long description indeed. A very long description indeed. A very long description indeed. A very long description indeed. A very long description indeed. A very long description indeed. A very long description indeed. A very long description indeed. A very long description indeed. A very long description indeed.'

    try {
        await task.save()
    } catch (e) {
        console.log('Exceeding the length field throws an error!')
        console.error(e)
    }
}
