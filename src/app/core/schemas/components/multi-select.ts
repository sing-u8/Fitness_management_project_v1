import { CenterUser } from '@schemas/center-user'

export type MultiSelectValue = { name: string; value: CenterUser; checked: boolean; disabled?: boolean }
export type MultiSelect = Array<MultiSelectValue>
