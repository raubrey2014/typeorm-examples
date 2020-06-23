import { getConnection } from 'typeorm'
import Team from '../entity/Team'

/**
 *
 * This exhibits the use of:
 * 1. postgres specific geometry types
 *
 */
export default async (): Promise<void> => {
    const connection = getConnection()

    const team = new Team()
    team.name = 'Cool Team'
    team.latLong = { x: 12.1234, y: -34.1234 }
    await connection.manager.save(Team, team)

    const teamRetrieved = await connection.manager.find(Team)
    console.log(teamRetrieved)
}
