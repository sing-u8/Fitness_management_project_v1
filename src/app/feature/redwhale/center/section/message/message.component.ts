import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, ViewChild, ElementRef } from '@angular/core'
import { FormBuilder, FormControl, ValidationErrors, AsyncValidatorFn, AbstractControl } from '@angular/forms'
import dayjs from 'dayjs'

// schema
import { Center } from '@schemas/center'
import { User } from '@schemas/user'
import { CenterUser } from '@schemas/center-user'

// services
import { StorageService } from '@services/storage.service'

// rxjs
import { Subject } from 'rxjs'
import { take, takeUntil } from 'rxjs/operators'

// ngrx
import { Store, select } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'

import * as FromSMS from '@centerStore/reducers/sec.sms.reducer'
import * as SMSSelector from '@centerStore/selectors/sec.sms.selector'
import * as SMSActions from '@centerStore/actions/sec.sms.actions'
import { SMSTypeInit } from '@centerStore/reducers/sec.sms.reducer'

@Component({
    selector: 'rw-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, OnDestroy {
    public center: Center

    public selectedNumber = 0

    public userSearchInput: FormControl
    public usersSelectCateg$ = this.nxStore.select(SMSSelector.usersSelectCategs)
    public usersLists$ = this.nxStore.select(SMSSelector.usersLists)
    public searchedUsersLists$ = this.nxStore.select(SMSSelector.searchedUsersLists)
    public selectedUserList$ = this.nxStore.select(SMSSelector.curUserListSelect)
    public isLoading$ = this.nxStore.select(SMSSelector.isLoading)
    public selectedUserListsHolding$ = this.nxStore.select(SMSSelector.selectedUserListsHolding)
    public selectSMSType$ = this.nxStore.select(SMSSelector.smsType)
    public smsType: FromSMS.SMSType = FromSMS.SMSTypeInit
    setSMSType(st: FromSMS.SMSType) {
        this.nxStore.dispatch(SMSActions.setSMSType({ smsType: st }))
    }
    public smsPoint$ = this.nxStore.select(SMSSelector.smsPoint)

    public unsubscribe$ = new Subject<boolean>()

    constructor(private nxStore: Store, private storageService: StorageService, private fb: FormBuilder) {}

    ngOnInit(): void {
        this.center = this.storageService.getCenter()

        this.nxStore.pipe(select(SMSSelector.curCenterId), take(1)).subscribe((curCenterId) => {
            if (curCenterId != this.center.id) {
                this.nxStore.dispatch(SMSActions.resetAll())
                this.nxStore.dispatch(SMSActions.startLoadMemberList({ centerId: this.center.id }))
            }
        })
        this.nxStore.dispatch(SMSActions.startGetSMSPoint({ centerId: this.center.id }))
        this.nxStore.dispatch(SMSActions.startGetUsersByCategory({ centerId: this.center.id }))
        this.nxStore.dispatch(SMSActions.setCurCenterId({ centerId: this.center.id }))
        this.selectSMSType$.pipe(takeUntil(this.unsubscribe$)).subscribe((smsType) => {
            this.smsType = smsType
        })
    }
    ngOnDestroy() {
        this.unsubscribe$.next(true)
        this.unsubscribe$.complete()
    }

    // message route : general
    public generalTransmissionTime = {
        immediate: true,
        book: false,
    }
    onGeneralTransmissionTimeClick(type: 'immediate' | 'book') {
        if (type == 'immediate') {
            this.generalTransmissionTime.immediate = true
            this.generalTransmissionTime.book = false
        } else if (type == 'book') {
            this.generalTransmissionTime.immediate = false
            this.generalTransmissionTime.book = true
        }
    }

    public bookDateText: string = dayjs().format('YYYY.MM.DD (ddd)')
    public bookDate = { date: dayjs().format('YYYY-MM-DD') }
    public showBookDate = false
    closeBookDate() {
        this.showBookDate = false
    }
    toggleBookDate() {
        this.showBookDate = !this.showBookDate
    }
    onBookDateChange(data: { date: string }) {
        this.bookDateText = dayjs(data.date).format('YYYY.MM.DD (ddd)')
    }

    public bookTime = '10:00:00'
    onBookTimeClick(time: { key: string; name: string }) {
        this.bookTime = time.key
    }

    public showResetModal = false
    public showResetModalData = {
        text: '선택한 인원을 초기화하시겠어요?',
        subText: `다른 카테고리로 이동 할 경우,
                현재 선택한 인원이 모두 초기화됩니다.`,
        cancelButtonText: '취소',
        confirmButtonText: '초기화 후 이동하기',
    }
    openShowResetModal() {
        this.showResetModal = true
    }
    onCancelResetModal() {
        this.showResetModal = false
    }
    onConfirmResetModal() {
        this.showResetModal = false
    }

    public showTransmitMsgModal = false
    public showTransmitMsgModalData = {
        text: `문자 ${'100'}건을 전송하시겠어요?`,
        subText: `전송하기 버튼을 클릭하시면
                문자가 즉시 또는 예약한 일시에 전송됩니다.`,
        cancelButtonText: '취소',
        confirmButtonText: '전송하기',
    }
    onCancelTransmitMsg() {
        this.showTransmitMsgModal = false
    }
    onConfirmTransmitMsg() {
        this.showTransmitMsgModal = false
        // this.nxStore.dispatch(showToast({text:'문자 전송이 완료되었습니다.'}))
    }

    // message route : auto-transmission
    public membershipSettingObj = {
        settingTitle: '회원권 만기 시, 자동 전송 사용 여부',
        transType: '회원권',
    }
    public membershipTransmitAvailable = false
    public membershipTransmitDay = '7'
    public membershipTransmitTime = '10:00:00'
    public lockerSettingObj = {
        settingTitle: '락커 만기 시, 자동 전송 사용 여부',
        transType: '락커',
    }
    public lockerTransmitAvailable = false
    public lockerTransmitDay = '7'
    public lockerTransmitTime = '10:00:00'

    // message route : history
    public selectedDate: [string, string] = [
        dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
        dayjs().format('YYYY-MM-DD'),
    ]
    // onDateSeleted(date: [string, string]) {
    //     // this.nxStore.dispatch(SaleActions.setSelectedDate({ selectedDate: date }))
    //     this.selectedDate = date
    //     this.getSaleTableWrpper(this.selectedDate, this.tableOption)
    //     this.nxStore.dispatch(showToast({ text: '매출 조회 기간이 변경되었습니다.' }))
    // }
}
