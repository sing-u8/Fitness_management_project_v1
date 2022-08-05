import { Center } from '@schemas/center'
import { PermissionCategory } from '@schemas/permission-category'
export interface Modal {
    isVisible: boolean
    data: ModalData
}
export interface ModalData {
    text: string
    subText: string
    cancelButtonText?: string
    confirmButtonText?: string
}

export interface RoleModal {
    visible: boolean
    center: Center
    permissionCateg: Array<PermissionCategory>
}
