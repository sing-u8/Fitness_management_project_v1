export interface SMSHistory {
    id: string
    datetime: string
    state_code: string
    state_code_name: string
    type_code: string
    type_code_name: string
    receiver_user_name: string
    receiver_user_color: string
    receiver_user_picture: string
    receiver_center_user_name: string
    receiver_center_user_picture: string
    receiver_phone_number: string
    success_yn: boolean
}
