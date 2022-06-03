export interface StatsSalesSummary {
    this_month: StatsSalesSummaryItem
    last_month: StatsSalesSummaryItem
    today: StatsSalesSummaryItem
    yesterday: StatsSalesSummaryItem
}

export interface StatsSalesSummaryItem {
    card: number
    cash: number
    trans: number
    unpaid: number
}
