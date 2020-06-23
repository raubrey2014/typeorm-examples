import { getConnection, createConnection } from 'typeorm'
import migrations from '../migration'
import { User } from '../entity/User'
import { Task } from '../entity/Task'
import Team from '../entity/Team'
/**
 *
 */
export default async (schemaNameRaw: string): Promise<void> => {
    const schemaName = schemaNameRaw.toLocaleLowerCase()
    const connection = getConnection()
    await connection.createQueryRunner().createSchema(schemaName, true)
    await connection.query(`SET search_path TO ${schemaName},public,postgis`)

    try {
        const newConnection = await createConnection({
            name: schemaName,
            type: 'postgres',
            schema: schemaName,
            host: 'localhost',
            port: 5432,
            username: 'explorer',
            password: 'password',
            database: 'exploration-db',
            entities: [User, Task, Team],
            migrations: migrations,
        })

        /**
         * This part is crucial! The default behavior did not seem to work. No combination
         * of using migrationRun, newConnection.manager.runMigrations() would set the
         * search_path.
         *
         * search_path is where postgres looks to make DDL level changes, i.e. which
         * schema am I making these migration changes to if no schema is specified?
         * The way that we ensure these migrations (which are created by typeorm cli
         * and have no schema information as you can see) run on the correct schema
         * is by in essense setting the default.
         *
         * This says, first look to this new schema "schemaName" before looking
         * at the public schema.
         */
        await newConnection.query(`SET search_path TO ${schemaName},public`)
        await newConnection.runMigrations()
        await newConnection.query(`SET search_path TO public`)

        try {
            await newConnection.manager.save(User, { firstName: 'ryan', lastName: 'aubrey', age: 25 })
            await newConnection.manager.save(User, { firstName: 'another', lastName: 'example', age: 99 })

            const ryans = await newConnection.manager.find(User, { firstName: 'ryan' })
            if (ryans.length === 1) {
                console.log('Users created successfully in new schema!')
            }
        } finally {
            await newConnection.manager.delete(User, {})
            await newConnection.close()
        }
    } catch (e) {
        console.error('Migrations error', e)
    }
}
