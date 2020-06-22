import { getConnection, getManager } from 'typeorm'
import { User } from '../entity/User'
import { Task } from '../entity/Task'
import UserRepo from '../repositories/UserRepo'
import { Client as RawClient, Client } from 'pg'

const transactionRollbacks = async (): Promise<void> => {
    const connection = getConnection()
    try {
        await connection.manager.transaction(async (transactionManager) => {
            /**
             * Everything inside here will run inside of a transaction
             * ONLY for operations run through the transaction manager
             * local to this call back
             */

            await transactionManager.save(Task, { description: 'An example transaction task' })

            /**
             * THIS WILL FAIL - we did not include the required age field
             * and thus we should see task not save
             */
            await transactionManager.save(User, { firstName: 'Ryan', lastName: 'Aubrey' })
        })
    } catch (e) {
        // we know this gets fired...
    }

    /**
     * Another way of doing this involves using the @Transaction decorators
     */
    try {
        const userRepo = new UserRepo()
        await userRepo.saveUserAndTask(
            getManager(),
            connection.manager.create(User, { firstName: 'Ryan', lastName: 'Aubrey' }),
            connection.manager.create(Task, { description: 'Another transaction' }),
        )
    } catch (e) {
        // same as above.. we know there will be an exception thrown...
    }

    /**
     * If the transaction worked correctly, the above
     * task should not have been saved
     */
    const tasks = await connection.manager.find(Task)
    console.log('There were', tasks.length, 'tasks saved!')
    if (tasks.length === 0) console.log('The transaction correctly rolled back our actions.')
}

const transactionSuccess = async (): Promise<void> => {
    const connection = getConnection()
    /**
     * This is a successful example, and we want to check the xmin field
     * on the postgres rows to see that they were indeed saved within the
     * same transaction.
     *
     * Check it: https://devcenter.heroku.com/articles/postgresql-concurrency
     *
     * Postgres uses the concept of a snapshot to look at the state of the database
     * before running a transaction. Thus, rows affected by a transaction are
     * labeled with the transaction id one less than the current id and stored
     * in a column `xmin`
     */
    await connection.manager.transaction('SERIALIZABLE', async (manager) => {
        const user = manager.create(User, { firstName: 'Ryan', lastName: 'Aubrey', age: 25 })
        const task = manager.create(Task, { description: 'Another transaction' })
        await manager.save(user)
        await manager.save(task)
    })

    /**
     * To check the xmin column we use the pg driver to get a more
     * raw look at the database
     *
     */
    const rawClient = new RawClient({
        host: 'localhost',
        port: 5432,
        user: 'explorer',
        password: 'password',
        database: 'exploration-db',
    })

    await rawClient.connect()

    const txId = await rawClient.query('SELECT txid_current();')
    const tasks = await rawClient.query('SELECT *, xmin FROM tasks;')
    console.log('********* TASKS *********')
    const users = await rawClient.query('SELECT *, xmin FROM users;')
    console.log('********* USERS *********')
    console.log('The transaction should have been run with id: ', txId.rows[0]['txid_current'])
    console.log('Thus, User created in transaction with xmin: ', users.rows[0]['xmin'])
    console.log('Task created in transaction with xmin: ', tasks.rows[0]['xmin'])
    await rawClient.end()
}

/**
 * This example exhibits the capabilities of:
 * 1. Transactions directly using the entity manager
 *
 */
export default async (): Promise<void> => {
    await transactionRollbacks()
    await transactionSuccess()
}
