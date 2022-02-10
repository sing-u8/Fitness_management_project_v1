export interface Gym {
    id: string
    name: string
    address: string
    picture: string
    color: string
    background: string
    timezone: string
    operating_days: string
    operating_start_time: string
    operating_end_time: string
    role_code: string
    role_name: string
    permissions: Array<string>
}
