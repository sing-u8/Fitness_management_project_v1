export interface Center {
    id: string
    name: string
    address: string
    color: string
    timezone: string
    picture: string
    background: string
    role_code: string // owner, member
    role_name: string //
    permissions: Array<string> // 권한 코드 리스트
    // operating_days: string
    // operating_start_time: string
    // operating_end_time: string
}
