import {
    Component,
    Input,
    ElementRef,
    Renderer2,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    AfterViewChecked,
    OnInit,
    ViewChild,
} from '@angular/core'

import _ from 'lodash'
import { UsersService } from '@services/users.service'
import { StorageService } from '@services/storage.service'

import { ClickEmitterType } from '@schemas/components/button'
import { User } from '@schemas/user'

// ngrx
import { Store, select } from '@ngrx/store'
import { roleModalSelector } from '@appStore/selectors'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

export interface modalData {
    text: string
    subText: string
    cancelButtonText: string
    confirmButtonText: string
}

@Component({
    selector: 'rw-setting-show-sale-modal',
    templateUrl: './setting-show-sale-modal.component.html',
    styleUrls: ['./setting-show-sale-modal.component.scss'],
})
export class SettingShowSaleModalComponent implements OnChanges, AfterViewChecked, OnInit {
    @Input() visible: boolean
    @Input() data: modalData
    @Input() value: {
        value: boolean
    }
    @Output() valueChange = new EventEmitter<{
        value: boolean
    }>()

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<{ openSale: boolean; clickEmitter: ClickEmitterType }>()

    public user: User

    public initUserData: any

    public toast_menu_text: string

    public isMouseModalDown: boolean

    nameValid: boolean

    changed: boolean

    constructor(private el: ElementRef, private renderer: Renderer2, private storageService: StorageService) {
        this.user = this.storageService.getUser()
        this.isMouseModalDown = false
        this.nameValid = false
    }
    ngOnInit() {}
    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && !changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
    }
    ngAfterViewChecked() {
        if (this.changed) {
            this.changed = false

            if (this.visible) {
                this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'display-block')
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
            }
        }
    }

    onCancel(): void {
        this.cancel.emit({})
        // this.valueChange.emit(this.value)
    }

    onConfirm(ClickEmitter: ClickEmitterType): void {
        ClickEmitter.showLoading()
        this.confirm.emit({ clickEmitter: ClickEmitter, openSale: this.value.value })
        // this.valueChange.emit(this.value)
    }
    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
}
