import { Task } from '../entity/Task'
import { v4 as uuidV4 } from 'uuid'

/**
 *
 * This demonstrates presetting uuid's for a primary generated column
 *
 */
export default async (): Promise<void> => {
    const id = uuidV4()
    const task = new Task()
    task.id = id
    task.description = 'Example'
    console.log('Saving task with id: ', id)
    await task.save()
    console.log("Task's id after saving: ", task.id)
}
