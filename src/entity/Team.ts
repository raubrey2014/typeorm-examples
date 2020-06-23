import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { User } from './User'

@Entity({
    name: 'teams',
})
class Team {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @OneToMany(() => User, (u) => u.team)
    members: Promise<User[]>
}

export default Team
