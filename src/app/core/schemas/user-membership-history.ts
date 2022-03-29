export interface UserMembershipHistory {
    id: string
    type_code: string
    type_code_name: string
    start_date: string
    end_date: string
    pause_start_date: string
    pause_end_date: string
    count: number
    unlimited: boolean
    created_by: string
    created_at: string
    updated_by: string
    updated_at: string
}
