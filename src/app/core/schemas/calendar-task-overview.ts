export interface CalendarTaskOverview {
    id: string
    calendar_task_group_id: string
    type_code: string
    type_code_name: string
    name: string
    all_day: boolean
    start: string
    end: string
    color: string
    memo: string
    repeat_cycle: number
    repeat_cycle_unit_code: string
    repeat_day_of_the_week: string // ex) 0,1,2,3,4,5,6
    repeat_termination_type_code: string
    repeat_count: number
    repeat_start_date: string
    repeat_end_date: string
    responsibility_center_user_ids: string // ex) test-id1, test-id2
    responsibility_center_user_names: string
    calendar_task_class_type_code: string
    capacity: number
    booked_count: number
    start_booking: string
    end_booking: string
    cancel_booking: string
}
