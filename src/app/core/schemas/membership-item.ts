import { ClassItem } from './class-item'

export interface MembershipItem {
    id: string
    category_id: string
    category_name: string
    name: string
    days: number
    count: number
    unlimited: boolean
    price: number
    color: string
    memo: string
    sequence_number: number
}

export interface FE_MembershipItem extends MembershipItem {
    class_items: Array<ClassItem>
}

export const DragulaMembership = 'D_MEMBERSHIP'
export const DragulaMembershipCategory = 'D_MEMBERSHIP_CATEGORY'
