import { EventSubscriber, EntitySubscriberInterface, InsertEvent, RemoveEvent } from 'typeorm'
import { TaskHistoryInherit, HistoryAction } from '../entity/TaskHistoryInherit'
import { Task } from '../entity/Task'

@EventSubscriber()
export class TaskInheritSubscriber implements EntitySubscriberInterface {
    listenTo(): Function {
        return Task
    }

    async afterInsert(event: InsertEvent<Task>): Promise<void> {
        const repo = event.manager.getRepository(TaskHistoryInherit)
        const trackEvent = repo.create({
            action: HistoryAction.INSERT,
            userId: event.entity.auditTrackingFingerprint,
            ...event.entity,
        })
        await repo.save(trackEvent)
    }

    async afterUpdate(event: InsertEvent<Task>): Promise<void> {
        const repo = event.manager.getRepository(TaskHistoryInherit)
        const trackEvent = repo.create({
            action: HistoryAction.UPDATE,
            userId: event.entity.auditTrackingFingerprint,
            ...event.entity,
        })
        await repo.save(trackEvent)
    }

    async beforeRemove(event: RemoveEvent<Task>): Promise<void> {
        const repo = event.manager.getRepository(TaskHistoryInherit)
        const trackEvent = repo.create({
            action: HistoryAction.DELETE,
            userId: event.entity.auditTrackingFingerprint,
            ...event.entity,
        })
        await repo.save(trackEvent)
    }
}
