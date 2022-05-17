import {
    Component,
    OnInit,
    OnDestroy,
    SimpleChanges,
    ElementRef,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    Renderer2,
    OnChanges,
    AfterViewChecked,
} from '@angular/core'

import dayjs from 'dayjs'

import { StorageService } from '@services/storage.service'
import { CenterUsersLockerService, UpdateLockerTicketReqBody } from '@services/center-users-locker.service.service'

// components
import { ClickEmitterType } from '@shared/components/common/button/button.component'

import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { UserLocker } from '@schemas/user-locker'
import { LockerItem } from '@schemas/locker-item'

// ngrx
import { Store } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'

@Component({
    selector: 'db-modify-locker-fullmodal',
    templateUrl: './modify-locker-fullmodal.component.html',
    styleUrls: ['./modify-locker-fullmodal.component.scss'],
})
export class ModifyLockerFullmodalComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
    @Input() visible: boolean
    @Input() centerUser: CenterUser
    @Input() userLocker: UserLocker

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() close = new EventEmitter<void>()
    @Output() confirm = new EventEmitter<any>()

    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    public changed: boolean

    public center: Center

    public datepickFlag: { end: boolean } = { end: false }

    onEndDateBtClick(event) {
        this.datepickFlag.end = !this.datepickFlag.end
        event.stopPropagation()
    }
    endDatepickClickOutside(event) {
        this.datepickFlag.end = false
        event.stopPropagation()
    }

    public date = { startDate: '', endDate: '' }

    constructor(
        private renderer: Renderer2,
        private centerUsersLockerService: CenterUsersLockerService,
        private storageService: StorageService,
        private nxStore: Store
    ) {}

    setUserLockerData() {
        this.datepickFlag = { end: false }
        this.date = {
            startDate: this.userLocker.start_date,
            endDate: this.userLocker.end_date,
        }
    }

    public dayDiff = ''
    onDatePickRangeChange(event: { startDate: string; endDate: string }) {
        this.date = event
        this.dayDiff = String(this.getDayDiff(this.date))
    }
    getDayDiff(date: { startDate: string; endDate: string }) {
        const date1 = dayjs(date.startDate)
        const date2 = dayjs(date.endDate)

        return date2.diff(date1, 'day') + 1
    }

    ngOnInit(): void {
        this.center = this.storageService.getCenter()
    }
    ngOnDestroy(): void {}
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible'] && !changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
    }
    ngAfterViewChecked(): void {
        if (this.changed) {
            this.changed = false

            if (this.visible) {
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)
                this.setUserLockerData()
            } else {
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
            }
        }
    }

    // modify confirm
    confirmModify(loadingBt: ClickEmitterType) {
        if (!this.date.startDate || !this.date.endDate) {
            return
        }

        loadingBt.showLoading()
        const reqBody: UpdateLockerTicketReqBody = {
            start_date: this.date.startDate,
            end_date: this.date.endDate,
        }
        this.centerUsersLockerService
            .updateLockerTicket(this.center.id, this.centerUser.id, this.userLocker.id, reqBody)
            .subscribe((userMembership) => {
                this.nxStore.dispatch(showToast({ text: `'${this.userLocker.name}'정보가 수정되었습니다.` }))
                this.nxStore.dispatch(
                    DashboardActions.startGetUserData({ centerId: this.center.id, centerUser: this.centerUser })
                )
                loadingBt.hideLoading()
                this.confirm.emit()
            })
    }
}