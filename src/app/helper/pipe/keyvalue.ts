import { KeyValue } from '@angular/common'

// Preserve original property order
export const originalOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
    return 0
}

export const reverseOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
    return -1
}

// Order by ascending property value
export const valueAscOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
    return a.value.localeCompare(b.value)
}

// Order by descending property key
export const keyDescOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
    return a.key > b.key ? -1 : b.key > a.key ? 1 : 0
}
