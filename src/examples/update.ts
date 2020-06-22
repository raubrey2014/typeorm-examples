import { Task } from '../entity/Task'
import { User } from '../entity/User'
import { getRepository } from 'typeorm'

/**
 *
 * Updates should always be done through the .save() function
 * The .update() is a primitive function does not take cascades or relationships
 *
 *
 * This example exhibits the capabilities of:
 * 1. Update date column
 *
 */
export default async (): Promise<void> => {
    const user = new User()
    user.firstName = 'Ryan'
    await getRepository(User).save(user)

    const task = new Task()
    task.creator = user
    task.description = 'Example'
    await task.save()
    // UpdateDateColumn example
    console.log('Task created and marked with update Date: ', task.updatedDate.toLocaleDateString())

    await new Promise((resolve) => setTimeout(() => resolve(), 1000))
    task.description = 'Second example'
    await task.save()
    console.log('Task updated one second later: ', task.updatedDate.toLocaleDateString())
}
