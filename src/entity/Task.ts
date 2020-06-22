import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm'
import { User } from './User'

/**
 * This is an example of the ActiveRecord pattern.
 *
 * const task = new Task()
 * task.description = 'example'
 * task.save()
 */
@Entity({
    name: 'tasks',
})
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    /**
     * Using the length field, if you save a Task with a description longer
     * than 256, what happens?
     */
    @Column({ length: 256 })
    description: string

    /**
     * This is an example of eager loading of a relation. If at the time
     * this entity is loaded, there exists a related creator, it will be loaded
     *
     * Every time we load a Task, the creator of that task (a User)
     * will also be loaded. You cannot set both sides of the relation to be
     * eager. Since this one is eager, the other must be left alone or
     * explicitly set to lazy (property type or Promise<...>)
     */
    @ManyToOne(() => User, (u) => u.tasks, { eager: true, onDelete: 'CASCADE' })
    creator: User

    /**
     * This is an example of the CreateDateColumn decorator, where
     * upon save for the first time, a Task will be enriched with
     * a createdDate field and stored.
     *
     * Can this field be changed?
     */
    @CreateDateColumn()
    createdDate: Date

    /**
     * This gets updated after any save() or soft delete
     */
    @UpdateDateColumn()
    updatedDate: Date

    @VersionColumn()
    version: number
}
