import { GymUser } from './gym-user'

export interface Sale {
    sales_data: Array<SalesData>
    statistics: Statistics
}
export interface SaleDashboard {
    today_total: number
    today_cash: number
    today_card: number
    today_trans: number
    today_unpaid: number
    yesterday_total: number
    yesterday_cash: number
    yesterday_card: number
    yesterday_trans: number
    yesterday_unpaid: number
    this_month_total: number
    this_month_cash: number
    this_month_card: number
    this_month_trans: number
    this_month_unpaid: number
    last_month_total: number
    last_month_cash: number
    last_month_card: number
    last_month_trans: number
    last_month_unpaid: number
}

export interface TheDaySummary {
    today_total: number
    today_cash: number
    today_card: number
    today_trans: number
    today_unpaid: number
    yesterday_total: number
    yesterday_cash: number
    yesterday_card: number
    yesterday_trans: number
    yesterday_unpaid: number
}
export interface TheMonthSummary {
    this_month_total: number
    this_month_cash: number
    this_month_card: number
    this_month_trans: number
    this_month_unpaid: number
    last_month_total: number
    last_month_cash: number
    last_month_card: number
    last_month_trans: number
    last_month_unpaid: number
}

export interface SalesData {
    id: number
    sales_id: number
    category: string
    locker_ticket_id: number
    membership_id: number
    content_name: string
    price: number
    paid_date: string
    customer_id: string
    customer_name: string
    customer_family_name: string
    customer_given_name: string
    customer_picture: string
    customer_color: string
    assignee_id: string
    assignee_name: string
    assignee_family_name: string
    assignee_given_name: string
}

export interface Statistics {
    total: number
    cash: number
    card: number
    trans: number
    unpaid: number
}
