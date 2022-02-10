import { LessonItem } from '@schemas/lesson-item'
import { MembershipItem } from '@schemas/membership-item'
import { GymUser } from '@schemas/gym-user'
import { TaskLessonTrainer, TaskReservation } from '@schemas/task'
import { MembershipTicket as _MembershipTicket } from '@schemas/membership-ticket'

export interface HoldAllMemberRequestBody {
    start_date: string
    end_date: string
    including_locker_ticket_yn: boolean
    // including_locker_ticket: boolean
}
export interface HoldPartialMemberRequestBody {
    user_ids: Array<string>
    start_date: string
    end_date: string
    including_locker_ticket_yn: boolean
    // including_locker_ticket: boolean
}

export interface HoldMembershipTicketRequstBody {
    start_date: string
    end_date: string
}

export interface HoldLockerTicketRequstBody {
    start_date: string
    end_date: string
}

export interface AttendGymRequestBody {
    membership_number: string
    user_id?: string
}

export interface RegisterTicketRequestBody {
    membership: Array<{
        membership_item_id: number
        lesson_item_ids: [number]
        start_date: string
        end_date: string
        count: number
        infinity_yn: number
        price: number
        assignee_id: string
    }>
    locker: Array<{
        locker_item_id: number
        start_date: string
        end_date: string
        price: number
        assignee_id: string
    }>
    pay_cash: number
    pay_card: number
    pay_trans: number
    unpaid: number
    paid_date: string
}

export interface ModifyUserInformationRequestBody {
    gym_user_name?: string
    role_code?: string
    picture?: string
    memo?: string
}

export interface ModifyMembershipTicketRequestBody {
    lesson_item_ids?: Array<number>
    start_date?: string
    end_date?: string
    count?: number
    infinity_yn?: number
    assignee_id?: string
    total_price?: number
    pay_cash?: number
    pay_card?: number
    pay_trans?: number
    unpaid?: number
    refund?: number
    paid_date?: string
}

export interface ModifyLockerTicketRequestBody {
    end_date?: string
    assignee_id?: string
    total_price?: string
    cash?: string
    card?: string
    trans?: string
    unpaid?: string
    paid_date?: string
}

export interface ModifySalesRequestBody {
    pay_cash: number
    pay_card: number
    pay_trans: number
    unpaid: number
    paid_date: string
    membership: Array<{
        sales_by_content_id: number
        assignee_id: string
        price: number
    }>
    locker: Array<{
        sales_by_content_id: number
        assignee_id: string
        price: number
    }>
}

export type GetUserinterface = 'member' | 'employee' | 'attendance' | 'unpaid' | 'valid' | 'imminent' | 'expired'
export interface GetUserReturn {
    id: string
    provider: string
    family_name: string
    given_name: string
    picture: string
    sex: string
    birth_date: string
    email: string
    email_verified: number
    phone_number: string
    phone_number_verified: number
    membership_number: string
    fcm_token: string
    color: string
    terms_eula: number
    terms_privacy: number
    marketing_sms: number
    marketing_email: number
    notification_yn: number
    access_token: string
    refresh_token: string
    custom_token: string
    gym_user_name: string
    role_code: string
    role_name: string
    memo: string
    registration_at: string
    unpaid: number
    left_days_of_earliest_valid_membership_ticket: number
    left_days_of_earliest_imminent_membership_ticket: number
    elapsed_days_of_last_expired_membership_ticket: number
    attended_datetime: string
    attendance_id: string
}

// response interface

export interface UsersCountReturn {
    new: number
    member: number
    employee: number
    attendance: number
    valid: number
    imminent: number
    expired: number
    unpaid: number
}

export interface MembershipTicket {
    id: string
    gym_id: string
    status: string // use, finish, expired, holding
    name: string
    category_name: string
    content: string
    start_date: string
    end_date: string
    period: number
    remaining_days: number
    count: number
    infinity_yn: number
    reservation_count: number
    lesson_count: number
    price: number
    refund: number
    gym_name: string
    status_name: string
    lesson_item_list: Array<LessonItem>
    membership_item_list: Array<MembershipItem>
    assignee: GymUser
    holding_remaining_days: number
    holding_reservation_days: number
    holding_start_date: string
    holding_end_date: string
    history: Array<{
        id: string
        status: string
        start_datetime: string
        end_datetime: string
        period: number
        remaining_days: number
        count: number
        infinity_yn: number
        price: number
        reason: string
        reservation_id: string
        status_name: string
        created_at: string
    }>
}

export interface LockerTicket {
    id: string
    status: string // use, finish, expired, holding
    user_id: string
    user_name: string
    user_family_name: string
    user_given_name: string
    user_picture: string
    user_color: string
    gym_id: string
    gym_name: string
    remaining_days: number
    locker_category_id: string
    locker_category_name: string
    locker_item_id: string
    locker_item_name: string
    start_date: string
    end_date: string
    price: number
    paid_date: string
    assignee: GymUser
    holding_remaining_days: number
    holding_reservation_days: number
    holding_start_date: string
    holding_end_date: string
}

export interface TicketList {
    membership: Array<MembershipTicket>
    locker: Array<LockerTicket>
}

export interface PaymentStatement {
    content: string
    gym_id: string
    id: number
    items: Array<MembershipPaymentsItem | LockerPaymentsItem>
    paid_date: number
    pay_card: number
    pay_cash: number
    pay_trans: number
    refund: number
    unpaid: number
    user_id: string
}

export interface MembershipPaymentsItem {
    assignee_id: string
    assignee_name: string
    category: string
    content_name: string
    count: number
    customer_color: string
    customer_id: string
    customer_name: string
    customer_phone_number: number
    customer_picture: string
    end_date: string
    holding_remaining_days: number
    holding_reservation_days: number
    holding_start_date: string
    holding_end_date: string
    id: number
    infinity_yn: number
    lesson_item_list: Array<LessonItem>
    locker_ticket_id: null
    membership_ticket_id: number
    paid_date: string
    price: number
    remaining_days: number
    sales_id: number
    start_date: string
    status: string // 'user | holding | expired | finished '
}

export interface LockerPaymentsItem {
    assignee_id: string
    assignee_name: string
    category: string
    content_name: string
    customer_color: string
    customer_id: string
    customer_name: string
    customer_phone_number: number
    customer_picture: string
    end_date: string
    holding_remaining_days: number
    holding_reservation_days: number
    holding_start_date: string
    holding_end_date: string
    id: number
    locker_ticket_id: number
    membership_ticket_id: number
    paid_date: string
    price: number
    remaining_days: number
    sales_id: number
    start_date: string
    status: string
}

export type PaymentStatementList = Array<PaymentStatement>

export interface Reservation {
    id: number
    membership_ticket: _MembershipTicket
    status: string // valid, deleted, task_end, cancel_reservation_not_allowed
    task: {
        calendar_id: number
        color: string
        end: string
        escape_repetition_yn: number
        lesson: {
            color: string
            content: string
            id: number
            lesson_item_id: number
            minutes: number
            name: string
            people: number
            reservation: Array<TaskReservation>
            reservation_cancel_end_hour: number
            reservation_end_hour: number
            reservation_start_day: number
            trainers: Array<TaskLessonTrainer>
            interface: string
            interface_name: string
        }
        membership_item: string
        memo: string
        name: string
        repetition_code: string
        repetition_end_date: string
        repetition_id: number
        repetition_start_date: string
        start: string
        interface: string // onetoone, group, general
    }
}

export type ReservationList = Array<Reservation>
