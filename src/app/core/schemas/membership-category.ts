import { MembershipItem } from './membership-item'
export interface MembershipCategory {
    id: string
    name: string
    sequence_number: number
    item_count: number
}

export interface FE_MembershipCategory extends MembershipCategory {
    items: Array<MembershipItem>
}
