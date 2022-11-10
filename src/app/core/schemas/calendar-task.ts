import { CalendarTaskClass } from '@schemas/calendar-task-class'
import { CenterUser } from '@schemas/center-user'

export interface CalendarTask {
    id: string
    calendar_task_group_id: string
    type_code: 'calendar_task_type_normal' | 'calendar_task_type_class'
    type_code_name: string
    name: string
    all_day: boolean
    start: string
    end: string
    color: string
    memo: string
    repeat_cycle: number
    repeat_cycle_unit_code: string
    repeat_day_of_the_week: Array<number>
    repeat_termination_type_code: string
    repeat_count: number
    repeat_start_date: string
    repeat_end_date: string
    // responsibility: Array<CenterUser>
    responsibility: CenterUser
    class: CalendarTaskClass
}
