export interface SMSHistoryGroup {
    id: string
    datetime: string
    state_code: 'sms_state_ready' | 'sms_state_sent'
    state_code_name: string
    type_code: string
    type_code_name: string
    text: string
    reservation_datetime: string
    sms_auto_send_yn: boolean
    request: number
    success: number
    failure: number
}
