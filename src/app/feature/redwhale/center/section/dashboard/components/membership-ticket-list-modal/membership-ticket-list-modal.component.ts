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
import _ from 'lodash'

import { CenterMembershipService } from '@services/center-membership.service'
import { StorageService } from '@services/storage.service'

import { Center } from '@schemas/center'
import { MembershipItem } from '@schemas/membership-item'

@Component({
    selector: 'db-membershipTicketListModal',
    templateUrl: './membership-ticket-list-modal.component.html',
    styleUrls: ['./membership-ticket-list-modal.component.scss'],
})
export class MembershipTicketListModalComponent implements AfterViewChecked, OnChanges {
    @Input() visible: boolean

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<MembershipItem>()

    changed: boolean

    public isMouseModalDown: boolean

    public center: Center
    public membershipItemList = []

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private centerMembershipService: CenterMembershipService,
        private storageService: StorageService
    ) {
        this.isMouseModalDown = false

        this.center = this.storageService.getCenter()
        this.centerMembershipService.getCategoryList(this.center.id).subscribe((membershipCategList) => {
            this.membershipItemList = _.reduce(
                membershipCategList,
                (result, value) => {
                    _.forEach(value.items, (membershipitem) => [result.push(membershipitem)])
                    return result
                },
                []
            )
            console.log(
                'RegisterMembershipLockerComponent membershipCategList: ',
                membershipCategList,
                ';',
                this.membershipItemList
            )
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes['visible'].firstChange) {
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
    }

    onConfirm(item: MembershipItem): void {
        this.confirm.emit(item)
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
}
