import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'
import { Task } from './Task'

export enum HistoryAction {
    UPDATE = 'UPDATE',
    INSERT = 'INSERT',
    DELETE = 'DELETE',
}
/**
 * This tracking strategy copies all columns of the originally
 * tracked table
 */
@Entity({
    name: 'tasks_history_column_copy',
})
export class TaskHistoryInherit extends Task {
    @PrimaryGeneratedColumn('uuid', { name: 'audit_id' })
    auditId: string

    @Column({
        type: 'enum',
        enum: HistoryAction,
    })
    action: string

    /**
     * This gets updated after any save() or soft delete
     */
    @CreateDateColumn({ name: 'audit_recorded' })
    auditRecorded: Date

    @Column({ nullable: true })
    userId: string
}
