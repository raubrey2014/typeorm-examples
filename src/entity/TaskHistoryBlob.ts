import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'
import { Task } from './Task'

export enum HistoryAction {
    UPDATE = 'UPDATE',
    INSERT = 'INSERT',
    DELETE = 'DELETE',
}
/**
 * This is an example of the ActiveRecord pattern.
 *
 * const task = new Task()
 * task.description = 'example'
 * task.save()
 */
@Entity({
    name: 'tasks_history',
})
export class TaskHistoryBlob {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    subjectId: string

    @Column({
        type: 'enum',
        enum: HistoryAction,
    })
    action: string

    /**
     * This gets updated after any save() or soft delete
     */
    @CreateDateColumn()
    recorded: Date

    @Column({ nullable: true })
    userId: string

    @Column({ type: 'json', nullable: true })
    blob: Task
}
