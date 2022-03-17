import { UserInfo } from '@schemas/user-info'

export interface LockerItemHistory {
    id: string
    start_date: string
    end_date: string
    user: UserInfo
}
