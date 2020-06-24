import { User } from '../entity/User'
import { Task } from '../entity/Task'
import Team from '../entity/Team'
import { createConnection, Connection } from 'typeorm'
import { TaskBlobSubscriber } from '../subscriber/TaskHistoryBlobSubscriber'
import { TaskInheritSubscriber } from '../subscriber/TaskHistoryInheritSubscriber'
import { TaskHistoryBlob } from '../entity/TaskHistoryBlob'
import { TaskHistoryInherit } from '../entity/TaskHistoryInherit'
/**
 *
 * This exhibits the use of:
 * 1. .softDelete()
 * 2. .restore()
 * 3. Reliance on @DeleteDateColumn to get soft-delete functionality
 *
 */
export default async (): Promise<void> => {
    const newConnection = await createConnection({
        name: 'subscriber',
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'explorer',
        password: 'password',
        database: 'exploration-db',
        entities: [User, Task, Team, TaskHistoryBlob, TaskHistoryInherit],
        synchronize: true,
        subscribers: [TaskBlobSubscriber],
    })

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    await runBlobHistoryExample(newConnection)
    await newConnection.close()

    const newConnection2 = await createConnection({
        name: 'subscriber',
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'explorer',
        password: 'password',
        database: 'exploration-db',
        entities: [User, Task, Team, TaskHistoryBlob, TaskHistoryInherit],
        synchronize: true,
        subscribers: [TaskInheritSubscriber],
    })

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    await runInheritHistoryExample(newConnection2)
    await newConnection2.close()
}

async function runBlobHistoryExample(newConnection: Connection): Promise<void> {
    const task = newConnection.manager.create(Task, {
        description: 'A task to which we are subscribed!',
    })

    /**
     * We must set the "fingerprint" after the entity create
     * function so it does not get lost.
     *
     * We can now access this field in our subscribers without
     * it affecting any of the schema level save() operations.
     */
    task.auditTrackingFingerprint = 'abcd-1234-abcd-1234'
    await newConnection.manager.save(Task, task)

    task.description = 'This is an update'
    await newConnection.manager.save(Task, task)

    const id = task.id

    await newConnection.manager.remove(Task, task)

    /**
     * A historical look through the task history blob approach
     */
    const historyBlob = await newConnection.manager.find(TaskHistoryBlob, {
        subjectId: id,
    })
    for (const tracked of historyBlob.sort((a, b) => a.blob.version - b.blob.version)) {
        const task = tracked.blob
        console.log(`BLOB: ${tracked.action} enacted on version ${task.version}: ${task.description}`)
    }
}

async function runInheritHistoryExample(newConnection: Connection): Promise<void> {
    const task = newConnection.manager.create(Task, {
        description: 'A task to which we are subscribed!',
    })

    /**
     * We must set the "fingerprint" after the entity create
     * function so it does not get lost.
     *
     * We can now access this field in our subscribers without
     * it affecting any of the schema level save() operations.
     */
    task.auditTrackingFingerprint = 'abcd-1234-abcd-1234'
    await newConnection.manager.save(Task, task)

    task.description = 'This is an update'
    await newConnection.manager.save(Task, task)

    const id = task.id

    await newConnection.manager.remove(Task, task)

    /**
     * A historical look through the task history blob approach
     */

    const historyInherited = await newConnection.manager.find(TaskHistoryInherit, {
        id: id,
    })
    for (const tracked of historyInherited.sort((a, b) => a.version - b.version)) {
        console.log(`INHERITED: ${tracked.action} enacted on version ${tracked.version}: ${tracked.description}`)
    }
}
