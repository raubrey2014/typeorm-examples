import { TransactionManager, Transaction, EntityManager } from 'typeorm'
import { User } from '../entity/User'
import { Task } from '../entity/Task'

class UserRepo {
    @Transaction()
    async saveUserAndTask(@TransactionManager() manager: EntityManager, user: User, task: Task): Promise<void> {
        await manager.save(task)
        await manager.save(user)
    }
}

export default UserRepo
