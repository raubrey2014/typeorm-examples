# A Bunch of examples of things in TypeORM+Postgres

Steps to run this project:

1. Run `npm i` command
2. Ensure docker-compose is running the postgres database: `docker-compose up` from the base directory
3. Add a new example and run it from `src/index.ts`!
4. Run `npm run start` command

## Migrations

Everyone's favorite topic.

Typeorm provides all the tooling we need to create migrations. [This article](https://medium.com/better-programming/typeorm-migrations-explained-fdb4f27cb1b3) explains it the best :)


I have packaged up the commands (using locally installed version of ts-node and typeorm) in `package.json`.

### Generate a migration

When you have made changes to your schema and you have `synchronize` option set to `false` in your connection options, these changes will not be automatically detected and reflected onto your database schema! You must explicitly create migrations to alter your database schema.

So you want to change something....
1. Make the change in your entity file (e.g. User.ts)
2. run `npm run migration:generate`
3. Look inside /src/migrations and see the new timestamp prepended migration. It is simply a series of database operations!
4. For our particular use case, I will explicitly be exporting each migration, instead of using the TypeORM glob "migrations/**/*.ts" format. This level of specificity is required if, for example, you have different migrations per schema. Thus, we must export the newly created migration in /src/migration/index.ts
5. You can run your migrations from command line - `npm run migration:run`, but this will default to `public` schema