import { getConnection, getRepository } from 'typeorm'
import { User } from '../entity/User'

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

    // Boom!
    console.log('User was saved with id: ', user.id)

    user.nickNames = ['Guy', 'Another']
    await connection.manager.save(user)

    const userRetrieved = await getRepository(User).findOneOrFail({ nickNames: ['Guy'] })
    console.log(userRetrieved)
}
