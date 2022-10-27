import { PermissionItem } from '@schemas/permission-item'
export interface PermissionCategory {
    code: PermissionKeys
    name: string
    sequence_number: number
    items: Array<PermissionItem>
}

export type CenterPermissionCode = 'read_center' | 'update_center'
export type RolePermissionCode = 'create_role' | 'read_role' | 'update_role' | 'delete_role'
export type PermissionPermissionCode =
    | 'create_permission'
    | 'read_permission'
    | 'update_permission'
    | 'delete_permission'
export type UserPermissionCode = 'create_user' | 'read_user' | 'update_user'
export type ClassPermissionCode =
    | 'create_class_category'
    | 'read_class_category'
    | 'update_class_category'
    | 'delete_class_category'
    | 'create_class_item'
    | 'read_class_item'
    | 'update_class_item'
    | 'delete_class_item'
export type MembershipPermissionCode =
    | 'create_membership_category'
    | 'read_membership_category'
    | 'update_membership_category'
    | 'delete_membership_category'
    | 'create_membership_item'
    | 'read_membership_item'
    | 'update_membership_item'
    | 'delete_membership_item'
export type LockerPermissionCode =
    | 'create_locker_category'
    | 'read_locker_category'
    | 'update_locker_category'
    | 'delete_locker_category'
    | 'create_locker_item'
    | 'read_locker_item'
    | 'update_locker_item'
    | 'delete_locker_item'
export type CalendarPermissionCode =
    | 'create_calendar'
    | 'read_calendar'
    | 'update_calendar'
    | 'delete_calendar'
    | 'create_calendar_task'
    | 'read_calendar_task'
    | 'update_calendar_task'
    | 'delete_calendar_task'
export type UserMembershipPermissionCode =
    | 'create_user_membership'
    | 'read_user_membership'
    | 'update_user_membership'
    | 'delete_user_membership'
export type UserMembershipPaymentPermissionCode =
    | 'create_user_membership_payment'
    | 'read_user_membership_payment'
    | 'update_user_membership_payment'
    | 'delete_user_membership_payment'
export type UserLockerPermissionCode =
    | 'create_user_locker_payment'
    | 'read_user_locker_payment'
    | 'update_user_locker_payment'
    | 'delete_user_locker_payment'
export type UserLockerPaymentPermissionCode =
    | 'create_user_locker'
    | 'read_user_locker'
    | 'update_user_locker'
    | 'delete_user_locker'
export type StatsSalesPermissionCode = 'read_stats_sales'

export type PermissionKeys =
    | 'center'
    | 'role'
    | 'permission'
    | 'user'
    | 'class'
    | 'membership'
    | 'locker'
    | 'calendar'
    | 'user_membership'
    | 'user_locker'
    | 'user_locker_payment'
    | 'user_membership_payment'
    | 'stats_sales'

export type PermissionCode =
    | StatsSalesPermissionCode
    | UserLockerPermissionCode
    | UserMembershipPermissionCode
    | CalendarPermissionCode
    | LockerPermissionCode
    | MembershipPermissionCode
    | ClassPermissionCode
    | UserPermissionCode
    | PermissionPermissionCode
    | RolePermissionCode
    | CenterPermissionCode
    | UserMembershipPaymentPermissionCode
    | UserLockerPaymentPermissionCode

export type RoleCode = 'instructor' | 'administrator'
