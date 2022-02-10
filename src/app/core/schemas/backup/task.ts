import { MembershipItem } from '@schemas/membership-item'

export interface Task {
    id: number
    calendar_id: number
    name: string
    interface: string
    start_time: string // HH:mm:ss
    end_time: string // HH:mm:ss  --> 10:30:00
    date: string // YYYY-MM-DD
    color: string
    memo: string
    repetition_start_date: string // YYYY-MM-DD
    repetition_end_date: string // YYYY-MM-DD
    repetition_id: number
    repetition_code: string // all (매일 반복) , weekdays (평일마다 반복), weekend (주말마다 반복), ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    escape_repetition_yn: number
    status:
        | 'task_end'
        | 'full_amount_people'
        | 'before_reservation_duration'
        | 'after_reservation_duration'
        | 'reservation_available' // 위에서 아래 순으로 우선순위
    cancel_reservation_not_allowed_yn: number
    lesson: TaskLesson
    membership_item: Array<MembershipItem>
}

export interface TaskLesson {
    category_name: string
    color: string
    content: string
    id: string
    lesson_item_id: string
    minutes: number
    name: string
    people: number
    reservation: Array<TaskReservation>
    reservation_start_day: number
    reservation_end_hour: number
    reservation_cancel_end_hour: number
    trainers: Array<TaskLessonTrainer>
    interface: string
    interface_name: string
}

export interface TaskLessonTrainer {
    access_token: string
    attendance_id: number
    attended_datetime: number
    birth_date: string
    color: string
    custom_token: string
    elapsed_days_of_last_expired_membership_ticket: number
    email: string
    email_verified: number
    family_name: null
    fcm_token: string
    given_name: string
    gym_user_name: string
    id: string
    left_days_of_earliest_imminent_membership_ticket: number
    left_days_of_earliest_valid_membership_ticket: number
    marketing_email: number
    marketing_sms: number
    membership_number: string
    memo: string
    notification_yn: number
    phone_number: string
    phone_number_verified: number
    picture: string
    provider: string
    refresh_token: null
    registration_at: string
    role_code: string
    role_name: string
    sex: string
    terms_eula: number
    terms_privacy: number
    unpaid: number
}
export interface TaskLessonTrainerItem {
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
}

export interface TaskReservation {
    id: string
    user: {
        access_token: string
        attendance_id: number
        attended_datetime: number
        birth_date: string
        color: string
        custom_token: string
        elapsed_days_of_last_expired_membership_ticket: number
        email: string
        email_verified: number
        family_name: string
        fcm_token: string
        given_name: string
        gym_user_name: string
        id: string
        left_days_of_earliest_imminent_membership_ticket: number
        left_days_of_earliest_valid_membership_ticket: number
        marketing_email: number
        marketing_sms: number
        membership_number: string
        memo: string
        notification_yn: number
        phone_number: string
        phone_number_verified: number
        picture: string
        provider: string
        refresh_token: string
        registration_at: string
        role_code: string
        role_name: string
        sex: string
        terms_eula: number
        terms_privacy: number
        unpaid: number
    }
}

export interface TaskReservationItem {
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
}

// / ----------------------------------------------------------------------------------------

export interface MemberTask {
    calendar_id: number
    cancel_reservation_not_allowed_yn: number
    color: string
    escape_repetition_yn: number
    id: number
    lesson: TaskLesson
    membership_item: Array<MembershipItem>
    memo: string
    name: string
    repetition_code: string
    repetition_end_date: string
    repetition_id: number
    repetition_start_date: string
    date: string
    start_time: string
    end_time: string
    status:
        | 'task_end'
        | 'full_amount_people'
        | 'reserved'
        | 'before_reservation_duration'
        | 'after_reservation_duration'
        | 'reservation_available' // 위에서 아래 순으로 우선순위

    interface: 'onetoeone' | 'group' | 'general'
}
