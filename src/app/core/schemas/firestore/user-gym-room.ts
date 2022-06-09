import { CenterUser } from '@schemas/center-user'

export type Avatar = {
    color: string
    name: string
    picture: string
}
export type AvatarParam = Partial<Avatar>
export function createAvatarObj({ color = null, name = null, picture = null }: AvatarParam = {}) {
    return { color, name, picture }
}

export type UserGymRoom = {
    id?: string
    name?: string
    avatar?: Avatar
    gymId?: string
    leaveYn?: boolean
    type?: 'dm' | 'private'
    userList?: string[] // user id list
    unread?: number
    createAt?: number // timestamp
    updatedAt?: number // timestamp
}
export type UserGymRoomParam = Partial<UserGymRoom>
export function createUserGymRoomObj({
    id = null,
    name = null,
    avatar = createAvatarObj(),
    gymId = null,
    leaveYn = false,
    type = null, // , dm, group, public
    userList = [], // user id list
    unread = 0,
    createAt = Date.now(), // timestamp
    updatedAt = Date.now(), // timestamp
}: UserGymRoomParam = {}) {
    return { id, name, avatar, gymId, leaveYn, type, userList, unread, createAt, updatedAt }
}

// UserGymRoom used in frontEnd
export type UserGymRoomFE = UserGymRoomParam &
    Partial<{
        interlocutor: CenterUser
        doChatWithMe: boolean
        isTempRoom: boolean
    }>
