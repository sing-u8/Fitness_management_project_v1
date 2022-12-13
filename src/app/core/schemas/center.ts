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
}

export type RoleCode = 'owner' | 'member' | 'administrator' | 'instructor'
