import { getConnection, getRepository } from 'typeorm'
import { User } from '../entity/User'
import { Task } from '../entity/Task'

/**
 * This example exhibits the capabilities of:
 * 1. Generated primary columns
 * 2. Generated date columns
 *
 */
export default async (): Promise<void> => {
    const connection = getConnection()
    /**
     * Using the entity manager requires no special creation of
     * an intermediate repository. The one entity manager
     * can act upon all entities.
     *
     * Note! The id is not set before.. only after saving!
     */
    const user = new User()
    user.firstName = 'Timber'
    user.lastName = 'Saw'
    user.age = 25
    await connection.manager.save(user)

    const task = new Task()
    task.creator = user
    task.description = 'Example'
    await task.save()
    const task2 = new Task()
    task2.creator = user
    task2.description = 'Another Example'
    await task2.save()
    const task3 = new Task()
    task3.description = 'No Creator!!'
    await task3.save()

    const tasks = await user.tasks
    tasks.forEach((task) => console.log('User has a lazily loaded task of description:', task.description))

    /**
     * You can also use the other direction..
     */
    const newTask1 = new Task()
    newTask1.description = 'Not explicitly saved'
    await newTask1.save()
    user.tasks = Promise.resolve([newTask1])

    await getRepository(User).save(user)
    console.log('Saved users lazy tasks...')
    const newTasks = await user.tasks
    console.log(newTasks.length + ' tasks now created by user')
}
