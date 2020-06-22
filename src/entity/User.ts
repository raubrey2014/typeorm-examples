import { Entity, PrimaryGeneratedColumn, Column, VersionColumn, OneToMany } from 'typeorm'
import { Task } from './Task'

/**
 * This is an example of the data mapper pattern
 *
 * const user = new User()
 * user.firstName = 'Ryan'
 *
 * getRepository(User).save(user)
 */
@Entity({
    // all of these options are options
    name: 'users', // not necessary, it can be parsed from class name
    orderBy: {
        id: 'DESC',
    },
})
export class User {
    /**
     * A primary generated column is only generated after the .save()
     * function has been called (in this Date Mapper case) by a repo
     */
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', default: 'Jane' })
    firstName: string

    /**
     * We did not specify a default value for this field,
     * but we said it cannot be null. It will not be required.
     *
     */
    @Column({ type: 'varchar', nullable: true })
    lastName: string

    /**
     * With no default and no nullable set, this field will
     * default to not nullable, as default is nullable: false
     *
     */
    @Column()
    age: number

    /**
     * This is an example of version number column. This column
     * will be automatically updated when the create() and save()
     * methods are used via a repository.
     *
     * More research is required to understand when are the other
     * times to this column is updated or not.
     *
     * This would provide the mechanism to implement optimistic locking.
     * Along with this field, hooking into before and after the
     * update query, and getting how many results have been affected
     * by the update query, optimistic locking can be implemented.
     */
    @VersionColumn()
    version: number

    /**
     * This is an example of the array flag, only
     * supported natively in postgres. Note the type
     * still needs to be text with array:true.
     *
     * You can even do queries with array types:
     * getRepository(User).findOne({ nickNames: ['Example'] })
     *
     * This will match User entries with this exact set of nickNames,
     * there are no special rules for arrays. Exact match of the entire
     * array contents in these default find methods.
     */
    @Column({ type: 'text', array: true, nullable: true })
    nickNames: string[]

    /**
     * This is an example of lazy loading relations. The return type
     * of a promise tells us that when this field is accessed, it will
     * be loaded, but only if it is accessed.
     *
     * This is also an example of cascade. If a user is created with associated tasks,
     * saving that user will also save those tasks. It does not work in the opposite
     * direction, and both sides of the relationship are prohibited from both
     * having cascade properties set to true.
     *
     * Delete behavior, however, requires onDelete: 'CASCADE' to be set on the
     * Task entity.
     */
    @OneToMany(() => Task, (t) => t.creator, { cascade: true })
    tasks: Promise<Task[]>

    /**
     * ANTI-PATTERN:
     *
     * I think this is an anti-pattern for a few reasons.
     * 1. Entities are inherently coupled to your database. If you attach methods here, you are most likely
     *    colocating some domain logic.
     * 2. For this method to be present on your entity, you need an entity instantiated from new Entity(),
     *    but many methods like find or findOne return simple json objects that just contain the schema fields.
     *    This exampleMethod would not be defined on the User object as a result of find.
     */
    exampleMethod = (): void => console.log('Example method!')
}
