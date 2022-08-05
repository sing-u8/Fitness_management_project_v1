import { PermissionItem } from '@schemas/permission-item'
export interface PermissionCategory {
    code: string
    name: string
    sequence_number: number
    items: Array<PermissionItem>
}

export interface PermissionCategoryCodes {
    center: ['read_center', 'update_center']
    role: ['create_role', 'read_role', 'update_role', 'delete_role']
    permission: ['create_permission', 'read_permission', 'update_permission', 'delete_permission']
    user: ['create_user', 'read_user', 'update_user']
    class: [
        'create_class_category',
        'read_class_category',
        'update_class_category',
        'delete_class_category',
        'create_class_item',
        'read_class_item',
        'update_class_item',
        'delete_class_item'
    ]
    membership: [
        'create_membership_category',
        'read_membership_category',
        'update_membership_category',
        'delete_membership_category',
        'create_membership_item',
        'read_membership_item',
        'update_membership_item',
        'delete_membership_item'
    ]
    locker: [
        'create_locker_category',
        'read_locker_category',
        'update_locker_category',
        'delete_locker_category',
        'create_locker_item',
        'read_locker_item',
        'update_locker_item',
        'delete_locker_item'
    ]
    calendar: [
        'create_calendar',
        'read_calendar',
        'update_calendar',
        'delete_calendar',
        'create_calendar_task',
        'read_calendar_task',
        'update_calendar_task',
        'delete_calendar_task'
    ]
    user_membership: [
        'create_user_membership',
        'read_user_membership',
        'update_user_membership',
        'delete_user_membership'
    ]
    user_locker: ['create_user_locker', 'read_user_locker', 'update_user_locker', 'delete_user_locker']
    stats_sales: ['read_stats_sales']
}

export type Role = 'instructor'
