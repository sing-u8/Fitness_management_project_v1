import { UserLocker } from '@schemas/user-locker'
export interface LockerItem {
    id: string
    state_code: string // locker_item_state_ + empty, [in_use, stop]
    state_code_name: string
    name: string
    x: number
    y: number
    rows: number
    cols: number
    user_locker: UserLocker
}
