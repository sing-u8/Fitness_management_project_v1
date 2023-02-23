import { PermissionCode } from '@schemas/permission-category'

export interface Center {
    id: string
    name: string
    address: string
    open_time: string // hh:mm:ss
    close_time: string // hh:mm:ss
    all_day: boolean
    day_of_the_week: number[] // [0일 ~ 6토]
    color: string
    timezone: string
    picture: string
    background: string
    role_code: RoleCode
    role_name: string //
    permissions: Array<PermissionCode> // 권한 코드 리스트
    notice: string
    contract_terms: string
    free_trial_end_date: string // 오늘일자에서 무료체험기간(14일)과 유예기간(3일)을 더한 일자  ex) 오늘이 2023-02-23인 경우 free_trial_end_date -> 2023-03-12
}

export type RoleCode = 'owner' | 'member' | 'administrator' | 'instructor'
