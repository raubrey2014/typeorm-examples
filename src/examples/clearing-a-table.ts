import { getConnection } from 'typeorm'
import { Task } from '../entity/Task'
import { User } from '../entity/User'

export default async (): Promise<void> => {
    const connection = getConnection()

    /**
     * Using entity manager.
     *
     * Becuase task is using Active Record:
     * await Task.clear() // also accomplishes this
     */
    await connection.manager.clear(Task)

    /**
     * We cannot "clear" a relation that is referenced in a foreign key constraint
     *
     * connection.manager.clear(User) - even with { cascase: true }, cascade does not
     * deal with table level TRUNCATE commands.
     *
     * So instead we can use a delete() command with empty, or 'everything' options - {}
     *
     * also available with repo for data mapper pattern:
     * await getRepository(User).delete({})
     *
     */
    await connection.manager.delete(User, {})

    console.log('Cleared')
}
