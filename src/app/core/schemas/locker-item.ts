import { UserLocker } from '@schemas/user-locker'
export interface LockerItem {
    id: string
    state_code: 'locker_item_state_empty' | 'locker_item_state_in_use' | 'locker_item_state_stop_using'
    state_code_name: string
    name: string
    x: number
    y: number
    rows: number
    cols: number
    user_locker: UserLocker
}
