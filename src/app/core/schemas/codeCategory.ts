import { CodeItem } from './codeItem'

export interface CodeCategory {
    id: string
    text_ko: string
    text_en: string
    sequence_number: number
    items: CodeItem
}
