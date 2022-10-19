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
    ViewChild,
} from '@angular/core'

import { Payment } from '@schemas/payment'
import { UserMembership } from '@schemas/user-membership'

import { WordService } from '@services/helper/word.service'

import _ from 'lodash'

@Component({
    selector: 'db-detail-item-remove-modal',
    templateUrl: './detail-item-remove-modal.component.html',
    styleUrls: ['./detail-item-remove-modal.component.scss'],
})
export class DetailItemRemoveModalComponent implements OnChanges, AfterViewChecked {
    @Input() visible: boolean

    @Input() userName: string
    @Input() item: UserMembership | Payment
    @Input() type: 'membership' | 'payment' = 'membership'

    @Input() blockClickOutside = false

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<any>()

    changed: boolean

    public isMouseModalDown: boolean

    public contentInfoObj = {
        membership: [
            ['삭제되는 정보', '해당 회원권의 예약 내역,\n' + '결제 내역, 매출 정보 전체'],
            ['삭제되지 않는 정보', '회원권 등록 시 작성한 계약서'],
        ],
        payment: [
            ['삭제되는 정보', '해당 결제 내역, 매출 정보'],
            ['삭제되지 않는 정보', '회원권 등록 시 작성한 계약서'],
        ],
    }

    public itemName = ''
    setItemName() {
        switch (this.type) {
            case 'membership':
                this.itemName = this.item['name']
                break
            case 'payment':
                this.itemName = this.item['user_membership_name'] ?? this.item['user_locker_name']
                break
        }
    }
    public typeName = ''
    setTypeName() {
        switch (this.type) {
            case 'membership':
                this.typeName = '회원권'
                break
            case 'payment':
                this.typeName = '결제 내역'
                break
        }
    }

    constructor(private el: ElementRef, private renderer: Renderer2, private wordService: WordService) {
        this.isMouseModalDown = false
    }

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

                this.setTypeName()
                this.setItemName()
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
    }

    onConfirm(): void {
        this.confirm.emit({})
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
}
