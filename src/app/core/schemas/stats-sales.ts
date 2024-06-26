export interface StatsSales {
    date: string
    type_code: 'payment_type_refund' | 'payment_type_payment' | 'payment_type_transfer'
    type_code_name: string
    center_user_name: string
    center_user_phone_number: string
    product_type_code: string
    product_type_code_name: string
    product_name: string
    responsibility_center_user_name: string
    card: number
    cash: number
    trans: number
    unpaid: number
}
