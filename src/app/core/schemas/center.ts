export interface Center {
    id: string
    name: string
    address: string
    open_time: string // hh:mm:ss
    close_time: string // hh:mm:ss
    day_of_the_week: number[] // [0일 ~ 6토]
    color: string
    timezone: string
    picture: string
    background: string
    role_code: string // owner, member
    role_name: string //
    permissions: Array<string> // 권한 코드 리스트
    contract_terms: string
}
