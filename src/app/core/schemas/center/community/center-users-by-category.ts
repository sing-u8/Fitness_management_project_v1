export interface CenterUsersByCategory {
    category_code: CenterUsersCategory
    category_name:
        | '전체 회원'
        | '유효한 회원'
        | '미수금이 있는 회원'
        | '만료 예정인 회원'
        | '만료된 회원'
        | '센터 직원'
        | '오늘 출석한 회원'
    user_count: number
}

export type CenterUsersCategory = 'all' | 'valid' | 'unpaid' | 'to_expire' | 'expired' | 'employee' | 'check_in'
