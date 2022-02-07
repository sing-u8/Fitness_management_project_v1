export type modalType =
    | 'DELAVATAR'
    | 'NAME'
    | 'EMAIL'
    | 'PHONE'
    | 'PASSWORD'
    | 'SEX'
    | 'MARKETING_AGREE'
    | 'PUSH_NOTICE'
    | 'BIRTH_DATE'

export interface modalData {
    text: string
    subText: string
    cancelButtonText: string
    confirmButtonText: string
}
