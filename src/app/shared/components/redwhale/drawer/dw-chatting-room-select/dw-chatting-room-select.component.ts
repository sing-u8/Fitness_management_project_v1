import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core'

import { ControlValueAccessor } from '@angular/forms'

import { ChatRoom } from '@schemas/chat-room'
import { User } from '@schemas/user'
import { Loading } from '@schemas/store/loading'

@Component({
    selector: 'dw-chatting-room-select',
    templateUrl: './dw-chatting-room-select.component.html',
    styleUrls: ['./dw-chatting-room-select.component.scss'],
})
export class DwChattingRoomSelectComponent implements AfterViewInit, ControlValueAccessor {
    @Input() userRoomList: Array<ChatRoom>
    @Input() selectedRoom: ChatRoom
    @Input() user: User
    @Input() disabled: boolean
    @Input() width: string
    @Input() isLoading: Loading

    @Output() onRoomClick = new EventEmitter<ChatRoom>()
    roomClick(cr: ChatRoom) {
        this.onRoomClick.emit(cr)
        this.close()
    }
    @Output() onRoomChange = new EventEmitter<ChatRoom>()

    @ViewChild('selectElement') selectElement
    @ViewChild('selectedElement') selectedElement
    @ViewChild('itemsElement') itemsElement

    value: ChatRoom
    isOpen = false

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.disabled = false
        this.width = '260px'
    }

    ngAfterViewInit(): void {
        this.renderer.setStyle(this.itemsElement.nativeElement, 'width', this.width)

        if (this.width) {
            this.renderer.setStyle(this.itemsElement.nativeElement, 'width', `${this.width}px`)
        }
    }

    toggle() {
        if (this.disabled == false) {
            const display = this.itemsElement.nativeElement.style.display

            if (display == 'flex') {
                this.close()
            } else {
                this.renderer.setStyle(this.itemsElement.nativeElement, 'display', 'flex')
                this.isOpen = true
            }
        }
    }

    close() {
        this.renderer.setStyle(this.itemsElement.nativeElement, 'display', 'none')
        this.isOpen = false
    }

    onSelect(item: ChatRoom) {
        this.close()
        this.onChanged(item)
    }

    onChange = (value: ChatRoom) => {}
    onTouched = (_) => {}

    writeValue(value: any): void {
        this.value = value
    }

    registerOnChange(fn: any): void {
        this.onChange = (value: ChatRoom) => {
            fn(value)
        }
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn
    }

    onChanged(value: ChatRoom) {
        this.onRoomChange.emit(value)
        this.value = value
        this.onChange(value)
    }
}
