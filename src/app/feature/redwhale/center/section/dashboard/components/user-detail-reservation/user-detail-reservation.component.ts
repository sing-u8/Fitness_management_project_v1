import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { WordService } from '@services/helper/word.service'
import { CenterUsersBookingService } from '@services/center-users-booking.service'
import { StorageService } from '@services/storage.service'
import { DashboardHelperService } from '@services/center/dashboard-helper.service'

import _ from 'lodash'

// schemas
import { Booking } from '@schemas/booking'
import { Center } from '@schemas/center'

// ngrx
import { Store } from '@ngrx/store'
import * as DashboardReducer from '@centerStore/reducers/sec.dashboard.reducer'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import * as DashboardSelector from '@centerStore/selectors/sec.dashoboard.selector'
import { showToast } from '@appStore/actions/toast.action'
@Component({
    selector: 'db-user-detail-reservation',
    templateUrl: './user-detail-reservation.component.html',
    styleUrls: ['./user-detail-reservation.component.scss'],
})
export class UserDetailReservationComponent implements OnInit {
    @Input() curUserData: DashboardReducer.CurUseData = _.cloneDeep(DashboardReducer.CurUseDataInit)

    @Output() onRegisterML = new EventEmitter<void>()
    constructor(
        private nxStore: Store,
        private wordService: WordService,
        private centerUsersBookingService: CenterUsersBookingService,
        private storageService: StorageService,
        private dashboardHelper: DashboardHelperService
    ) {}

    ngOnInit(): void {}

    public center: Center = this.storageService.getCenter()

    public selectedUserBooking: Booking = undefined
    setSelectedUserBooking(userBooking: Booking) {
        this.selectedUserBooking = userBooking
    }

    // cancel book
    public showCancelBookModal = false
    public cancelBookModalData = {
        text: '',
        subText: `예약을 취소하실 경우,
                차감된 회원권 횟수가 1회 복구됩니다.`,
        cancelButtonText: '취소',
        confirmButtonText: '예약 취소',
    }
    openCancelBookModal() {
        console.log(
            'openCancel book modal : ',
            this.selectedUserBooking.name,
            '----',
            this.wordService.ellipsis(this.selectedUserBooking.name, 7),
            _.slice(this.selectedUserBooking.name, 0, 7)
        )
        this.cancelBookModalData.text = `'${this.wordService.ellipsis(
            this.selectedUserBooking.name,
            7
        )}' 예약을 취소하시겠어요?`
        this.showCancelBookModal = true
    }
    closeCancelBookModal() {
        this.showCancelBookModal = false
    }
    onCancelBookConfirm() {
        this.centerUsersBookingService
            .cancelBooking(this.center.id, this.curUserData.user.id, this.selectedUserBooking.id)
            .subscribe(() => {
                this.nxStore.dispatch(
                    showToast({
                        text: `'${this.wordService.ellipsis(
                            this.selectedUserBooking.name,
                            11
                        )}' 예약이 취소되었습니다.`,
                    })
                )
                this.nxStore.dispatch(
                    DashboardActions.startGetUserData({ centerId: this.center.id, centerUser: this.curUserData.user })
                )
                this.closeCancelBookModal()
            })
    }
}
