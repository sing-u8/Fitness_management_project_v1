export interface LockerItem {
    id: string
    state_code: 'locker_item_state_empty' | 'locker_item_state_in_use' | 'locker_item_state_stop_using'
    state_code_name: string
    name: string
    x: number
    y: number
    rows: number
    cols: number
    user_locker_center_user_name: string
    user_locker_end_date: string
}
