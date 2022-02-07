import { LessonItem } from './lesson-item'

export interface LessonCategory {
    id: string
    name: string
    items: Array<LessonItem>
}
