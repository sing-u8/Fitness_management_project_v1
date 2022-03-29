import { PermissionItem } from '@schemas/permission-item'
export interface PermissionCategory {
    code: string
    name: string
    sequence_number: number
    items: Array<PermissionItem>
}
