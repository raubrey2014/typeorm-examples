import 'reflect-metadata'
import { createConnection } from 'typeorm'

// How to run an example!
import example from './examples/migrations-on-a-schema'
import clear from './examples/clearing-a-table'

createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'explorer',
    password: 'password',
    database: 'exploration-db',
    synchronize: false,
    logging: true,
    entities: ['src/entity/**/*.ts'],
    migrations: ['src/migration/**/*.ts'],
})
    .then(async () => {
        // This clear() function will clean out our Task and User tables
        // .. this function is very similar to something you would want
        // to run before tests!
        await clear()
        await example('exampleclient1')
    })
    .catch((error) => console.log(error))
