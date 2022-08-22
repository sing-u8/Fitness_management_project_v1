export interface SMSHistoryGroup {
    id: string
    datetime: string
    state_code: string
    state_code_name: string
    type_code: string
    type_code_name: string
    text: string
    reservation_datetime: string
    request: number
    success: number
    failure: number
}
