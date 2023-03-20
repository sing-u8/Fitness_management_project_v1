export type PaymentItem = {
    top: {
        title: string
        desc: string
    }
    middle: {
        discountText: string
        originalPrice: string
        price: string
        desc: string
    }
    bottom: { left: string; right: string }[]
    type?: 'month' | 'year' | 'whole_time'
    count?: number
}
