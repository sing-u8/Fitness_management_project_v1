import { ClassItem } from './class-item'

export interface ClassCategory {
    id: string
    name: string
    items: Array<ClassItem>
}
