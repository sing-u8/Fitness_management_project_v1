// import { CenterUser } from './gym-user'
import { GetUserReturn } from './gym-dashboard'

export interface Attendance {
    id: string
    created_at: string
    user: GetUserReturn
}
