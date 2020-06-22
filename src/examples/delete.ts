import { getConnection } from 'typeorm'
import { User } from '../entity/User'

/**
 * Deletion in TypeORM is done through remove!
 *
 * When you think "delete this row in the database", think .remove()!
 *
 * This exhibits the use of:
 * 1. .remove()
 * 2. cascades in removal using onDelete: 'CASCADE' on Task entity
 *
 */
export default async (): Promise<void> => {
    const connection = getConnection()

    const user = new User()
    user.firstName = 'Timber'
    user.lastName = 'Saw'
    user.age = 25
    await connection.manager.save(user)
    console.log('After save, before delete - ', user.id)
    await connection.manager.remove(user)

    /** id is unset on remove! */
    console.log("What happens to user's id after removal? - ", user.id)
}
