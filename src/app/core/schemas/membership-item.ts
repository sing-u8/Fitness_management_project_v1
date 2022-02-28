import { ClassItem } from './class-item'

export interface MembershipItem {
    id: string
    category_name: string
    name: string
    days: number
    count: number
    unlimited: boolean
    price: number
    color: string
    memo: string
    sequence_number: number
    class_items: Array<ClassItem>
}
