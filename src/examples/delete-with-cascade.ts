import { getConnection } from 'typeorm'
import { User } from '../entity/User'
import { Task } from '../entity/Task'

/**
 * onDelete used for cascading deletion
 * https://github.com/typeorm/typeorm/issues/1460
 *
 * This exhibits the use of:
 * 1. cascades in removal using onDelete: 'CASCADE' on Task entity
 *
 */
export default async (): Promise<void> => {
    const connection = getConnection()

    /**
     * Cascading removal. If we set cascade: true option to be true
     * on the OneToMany relation in user, removing a user will remove
     * all related tasks.
     */
    const newUser = new User()
    newUser.firstName = 'Jane'
    newUser.lastName = 'Doe'
    newUser.age = 25
    await connection.manager.save(newUser)
    console.log('Created user')

    const task = new Task()
    task.creator = newUser
    task.description = 'Example'
    await task.save()
    console.log('Created related task')

    await connection.manager.remove(newUser)
    /** Note - when we call remove, the task is indeed
     * removed from the DB, but because of the onDelete field,
     * not because of the cascade: true option (very confusing).
     *
     * This operation of CASCADE is a lower level operation and
     * does not effect our task object here in memory. The id of the
     * task for example is still set.
     */
    console.log('What happens to task? - ', task)
}
