import 'reflect-metadata'
import { createConnection } from 'typeorm'

// How to run an example!
import example from './examples/soft-deletes'
import clear from './examples/clearing-a-table'

createConnection()
    .then(async () => {
        // This clear() function will clean out our Task and User tables
        // .. this function is very similar to something you would want
        // to run before tests!
        await clear()
        await example()
    })
    .catch((error) => console.log(error))
