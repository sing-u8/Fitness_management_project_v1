export interface Contract {
    id: string
    type_code: 'contract_type_new' | 'contract_type_renewal' | 'contract_type_transfer'
    type_code_name: string
    date: string
    user_membership_number: string
    user_name: string
    user_sex: string
    user_birth_date: string
    user_email: string
    user_phone_number: string
    user_picture: string
    user_sign: string
    responsibility: string
    terms: string
    memo: string
}
