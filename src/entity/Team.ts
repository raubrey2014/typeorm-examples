import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { User } from './User'

export interface Point {
    x: number
    y: number
}

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

    /**
     * This is an example of a more advanced data type in "point",
     * utilizing a trasnformer to convert between the raw postgres
     * representation and a typed object in Typescript world
     */
    @Column({
        type: 'point',
        name: 'lat_long',
        transformer: {
            from: (v) => v,
            to: (v) => `${v.x},${v.y}`, // { x: 1, y: 2 } -> '1,2'
        },
    })
    latLong: Point
}

export default Team
