export interface Drawer {
    tabName: DrawerTypes
}

export type DrawerTypes =
    | 'member'
    | 'community'
    | 'notification'
    | 'general-schedule'
    | 'lesson-schedule'
    | 'modify-general-schedule'
    | 'modify-lesson-schedule'
    | 'schedule-none'
    | 'none'

export type NoneType = 'none' | 'schedule-none'
