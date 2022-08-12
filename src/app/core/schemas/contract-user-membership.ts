import { ContractUserMembershipClass } from '@schemas/contract-user-membership-class'

export interface ContractUserMembership {
    category_name: string
    name: string
    start_date: string
    end_date: string
    count: number
    unlimited: boolean
    color: string
    card: number
    trans: number
    vbank: number
    phone: number
    cash: number
    unpaid: number
    memo: string
    responsibility: string
    class: Array<ContractUserMembershipClass>
}
