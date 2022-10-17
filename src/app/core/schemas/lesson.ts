import { CenterUser } from './center-user'

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

export const DragulaLesson = 'D_LESSON'
export const DragularLessonCategory = 'D_LESSON_CATEGORY'
