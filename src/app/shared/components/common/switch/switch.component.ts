import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
    selector: 'rw-switch',
    templateUrl: './switch.component.html',
    styleUrls: ['./switch.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SwitchComponent),
            multi: true,
        },
    ],
})
export class SwitchComponent implements ControlValueAccessor {
    @Input() text: string
    @Input() disabled: boolean

    @Output() change = new EventEmitter<boolean>()

    isChecked: boolean
    onChange = (_) => {
        console.log('onChange: ', _)
    }
    onTouched = (_) => {}

    constructor() {
        this.disabled = false
        this.isChecked = false
    }

    writeValue(value: boolean): void {
        this.isChecked = value
    }

    registerOnChange(fn: any): void {
        this.onChange = fn
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled
    }

    onChanged($event) {
        if (this.disabled) {
            return
        }

        this.isChecked = $event
        this.change.emit($event)
        this.onChange($event)
    }
}
