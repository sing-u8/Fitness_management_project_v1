export type User = {
    _id: string
    name: string
    avatar: string
    color: string
}
export type UserParam = Partial<User>
export function createUserObj({ _id = null, name = null, avatar = null, color = null }: UserParam = {}) {
    return { _id, name, avatar, color }
}

export type Link = {
    opengraphList: Array<any>
}
export type LinkParam = Partial<Link>
export function createLinkObj({ opengraphList = [] }: LinkParam = {}) {
    return { opengraphList }
}

export type File = {
    url: string
    originFileName: string
    mimeType: string
    byte: number
    thumbnail: string
}
export type FileParam = Partial<File>
export function createFileObj({
    url = null,
    originFileName = null,
    mimeType = null,
    byte = 0,
    thumbnail = null,
}: FileParam = {}) {
    return { url, originFileName, mimeType, byte, thumbnail }
}

export type MsgType = 'text' | 'info' | 'image' | 'file' | 'video' | 'date'
export type Message = {
    user: User
    link: Link
    file: Array<File>
    type: MsgType
    text: string
    timestamp: number
    unreadUserIds: Array<string>
    unreadCount: number
}
export type MessageParam = Partial<Message>
export function createMessageObj({
    user = { _id: null, name: null, avatar: null, color: null },
    link = { opengraphList: [] },
    file = [],
    type = null, // 'text', 'info', 'image', 'file', 'video'
    text = null,
    timestamp = Date.now(), // created at
    unreadUserIds = [], // user id list
    unreadCount = 0,
}: MessageParam = {}) {
    return { user, link, file, type, text, timestamp, unreadCount, unreadUserIds }
}
