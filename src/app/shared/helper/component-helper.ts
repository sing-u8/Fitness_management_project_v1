import { SimpleChanges } from '@angular/core'

export function detectChangesFor(changes: SimpleChanges, inputProp: string, changeFn: () => void) {
    if (
        changes[inputProp] &&
        !changes[inputProp].firstChange &&
        changes[inputProp].previousValue != changes[inputProp].currentValue
    ) {
        changeFn()
    }
}
