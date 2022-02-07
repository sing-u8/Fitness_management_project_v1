export interface GymRoomUser {
    leaveYn: boolean
    userId: string
    userJoinedTimestamp: number // timestamp
}
export type GymRoomUserParam = Partial<GymRoomUser>

export function createGymRoomUserObj({
    leaveYn = false,
    userId = null,
    userJoinedTimestamp = 0, // timestamp
}: GymRoomUserParam = {}): GymRoomUser {
    return { leaveYn, userId, userJoinedTimestamp }
}
