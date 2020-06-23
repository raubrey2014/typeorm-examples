import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddTeamsUsersAndTasks1592879183177 implements MigrationInterface {
    name = 'AddTeamsUsersAndTasks1592879183177'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "teams" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL DEFAULT 'Jane', "lastName" character varying, "age" integer NOT NULL, "deleteDate" TIMESTAMP, "version" integer NOT NULL, "nickNames" text array, "teamId" uuid, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying(256) NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "creatorId" uuid, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_d1803064187c8f38e57a9c4984c" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "tasks" ADD CONSTRAINT "FK_90bc62e96b48a437a78593f78f0" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_90bc62e96b48a437a78593f78f0"`)
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_d1803064187c8f38e57a9c4984c"`)
        await queryRunner.query(`DROP TABLE "tasks"`)
        await queryRunner.query(`DROP TABLE "users"`)
        await queryRunner.query(`DROP TABLE "teams"`)
    }
}
