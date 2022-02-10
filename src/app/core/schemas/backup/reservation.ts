export interface reservation {
    id: string
    user: {
        id: number
        gym_id: number
        user_id: string
        content: string
        pay_cash: number
        pay_card: number
        pay_trans: number
        unpaid: number
        paid_date: string
        refund: number
        items: Array<{
            id: number
            sales_id: string
            category: string
            locker_ticket_id: string
            membership_ticket_id: string
            content_name: string
            price: number
            paid_date: string
            customer_id: string
            customer_name: string
            customer_picture: string
            customer_color: string
            customer_phone_number: string
            assignee_id: string
            assignee_name: string
        }>
    }
}
