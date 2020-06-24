import { EventSubscriber, EntitySubscriberInterface, InsertEvent, RemoveEvent } from 'typeorm'
import { TaskHistoryBlob, HistoryAction } from '../entity/TaskHistoryBlob'
import { Task } from '../entity/Task'

@EventSubscriber()
export class TaskBlobSubscriber implements EntitySubscriberInterface {
    listenTo(): Function {
        return Task
    }

    async afterInsert(event: InsertEvent<Task>): Promise<void> {
        const repo = event.manager.getRepository(TaskHistoryBlob)
        const trackEvent = repo.create({
            subjectId: event.entity.id,
            action: HistoryAction.INSERT,
            userId: event.entity.auditTrackingFingerprint,
            blob: event.entity,
        })
        await repo.save(trackEvent)
    }

    async afterUpdate(event: InsertEvent<Task>): Promise<void> {
        const repo = event.manager.getRepository(TaskHistoryBlob)
        const trackEvent = repo.create({
            subjectId: event.entity.id,
            action: HistoryAction.UPDATE,
            userId: event.entity.auditTrackingFingerprint,
            blob: event.entity,
        })
        await repo.save(trackEvent)
    }

    async beforeRemove(event: RemoveEvent<Task>): Promise<void> {
        const repo = event.manager.getRepository(TaskHistoryBlob)
        const trackEvent = repo.create({
            subjectId: event.entity.id,
            action: HistoryAction.DELETE,
            userId: event.entity.auditTrackingFingerprint,
            blob: event.entity,
        })
        await repo.save(trackEvent)
    }
}
