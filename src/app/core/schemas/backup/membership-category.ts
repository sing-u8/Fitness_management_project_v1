import { MembershipItem } from './membership-item'

export interface MembershipCategory {
    id: string
    name: string
    items: Array<MembershipItem>
}
