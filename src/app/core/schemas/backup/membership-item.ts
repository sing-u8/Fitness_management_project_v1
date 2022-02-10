import { LessonItem } from './lesson-item'

export interface MembershipItem {
    id?: string
    category_name?: string
    name?: string
    days?: number
    count?: number
    infinity_yn?: number
    price?: number
    color?: string
    sequence_number?: number
    memo?: string
    lesson_item_list?: Array<LessonItem>
}
