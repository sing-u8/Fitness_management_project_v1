import { CenterUser } from './gym-user'

export interface Lesson {
    id: string
    lesson_item_id: string
    type: string
    name: string
    content: string
    people: number
    minutes: number
    color: string
    type_name: string
    trainers: Array<CenterUser>
}
