export interface Registration {
    // 약관동의
    service_terms?: boolean
    privacy?: boolean
    sms_marketing?: boolean
    email_marketing?: boolean
    // 가입완료
    regCompleted?: boolean
    // 유저 정보
    name?: string
    email?: string
    emailValid?: boolean
    password?: string
    passwordValid?: boolean
}
