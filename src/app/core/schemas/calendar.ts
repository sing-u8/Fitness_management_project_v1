import { CenterUser } from '@schemas/center-user'
export interface Calendar {
    id: string
    type_code: string
    type_code_name: string
    name: string
    calendar_user: CenterUser
}
