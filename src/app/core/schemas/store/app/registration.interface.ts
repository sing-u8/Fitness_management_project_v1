export interface Registration {
    // 약관동의
    termsEULA?: boolean
    termsPrivacy?: boolean
    marketingSMS?: boolean
    marketingEmail?: boolean
    // 가입완료
    regCompleted?: boolean
    // 유저 정보
    name?: string
    email?: string
    emailValid?: boolean
    password?: string
    passwordValid?: boolean
}
