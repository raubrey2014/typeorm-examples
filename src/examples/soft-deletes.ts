import { getConnection } from 'typeorm'
import { User } from '../entity/User'

/**
 *
 * This exhibits the use of:
 * 1. .softDelete()
 * 2. .restore()
 * 3. Reliance on @DeleteDateColumn to get soft-delete functionality
 *
 */
export default async (): Promise<void> => {
    const connection = getConnection()

    const user = new User()
    user.firstName = 'Timber'
    user.lastName = 'Saw'
    user.age = 25
    await connection.manager.save(user)
    await connection.manager.softDelete(User, user)

    const results = await connection.manager.findOne(User, { firstName: 'Timber' })
    if (!results) console.log('No results found after soft delete: check!')

    /**
     * Note the use of a third parameter of FindOneOptions in manager.findOne()!
     */
    const resultsDeleted = await connection.manager.findOne(User, { firstName: 'Timber' }, { withDeleted: true })
    if (resultsDeleted)
        console.log(
            'Found soft-delted user with { withDeleted: true } option. Was deleted at:',
            resultsDeleted.deleteDate,
        )

    await connection.manager.restore(User, user)
    if (!user.deleteDate) console.log('Restored the user!')
}
