import { ClassItem } from './class-item'

export interface ClassCategory {
    id: string
    name: string
    sequence_number: number
    item_count: number
}

export interface FE_ClassCategory extends ClassCategory {
    items: Array<ClassItem>
}
