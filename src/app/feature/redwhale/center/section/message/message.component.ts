import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, ViewChild, ElementRef } from '@angular/core'
import { FormBuilder, FormControl, ValidationErrors, AsyncValidatorFn, AbstractControl } from '@angular/forms'
import dayjs from 'dayjs'
import _ from 'lodash'

// schema
import { Center } from '@schemas/center'
import { User } from '@schemas/user'
import { CenterUser } from '@schemas/center-user'

// services
import { StorageService } from '@services/storage.service'
import { WordService } from '@services/helper/word.service'

// rxjs
import { Subject } from 'rxjs'
import { take, takeUntil } from 'rxjs/operators'

// ngrx
import { Store, select } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'

import * as FromSMS from '@centerStore/reducers/sec.sms.reducer'
import * as SMSSelector from '@centerStore/selectors/sec.sms.selector'
import * as SMSActions from '@centerStore/actions/sec.sms.actions'
import { Loading } from '@schemas/store/loading'
import { SMSAutoSend } from '@schemas/sms-auto-send'
import { setGeneralTransmissionTime } from '@centerStore/actions/sec.sms.actions'
import { SMSCaller } from '@schemas/sms-caller'
import { SMSHistoryGroup } from '@schemas/sms-history-group'

type AutoTransmitType = 'membership' | 'locker'

@Component({
    selector: 'rw-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, OnDestroy {
    public center: Center

    // ngrx -- common
    public smsPoint$ = this.nxStore.select(SMSSelector.smsPoint)
    public smsPoint = 0
    public textCountForSMSPoint = {
        short: 0,
        long: 0,
    }
    public isLoading$ = this.nxStore.select(SMSSelector.isLoading)
    public selectSMSType$ = this.nxStore.select(SMSSelector.smsType)
    // ngrx -- general
    public usersSelectCateg$ = this.nxStore.select(SMSSelector.usersSelectCategs)
    public usersLists$ = this.nxStore.select(SMSSelector.usersLists)
    public searchedUsersLists$ = this.nxStore.select(SMSSelector.searchedUsersLists)
    public selectedUserList$ = this.nxStore.select(SMSSelector.curUserListSelect)
    public selectedUserListSelected$ = this.nxStore.select(SMSSelector.selectedUserListsSelected)
    public selectedUserListSelected = 0
    public smsType: FromSMS.SMSType = FromSMS.SMSTypeInit
    setSMSType(st: FromSMS.SMSType) {
        this.nxStore.dispatch(SMSActions.setSMSType({ smsType: st }))
    }
    public callerList$ = this.nxStore.select(SMSSelector.callerList)
    public generalErrText = ''
    public generalText$ = this.nxStore.select(SMSSelector.generalText)
    public generalText = ''
    public generalTextByte = 0
    public subtractText = ''
    public subtractPoint = 0
    updateGeneralText(v: string) {
        this.nxStore.dispatch(SMSActions.setGeneralText({ text: v }))
    }
    public bookTime$ = this.nxStore.select(SMSSelector.bookTime)
    public bookDate$ = this.nxStore.select(SMSSelector.bookDate)
    public generalTransmissionTime$ = this.nxStore.select(SMSSelector.generalTransmissionTime)

    public generalCaller$ = this.nxStore.select(SMSSelector.generalCaller)
    public generalCaller: SMSCaller = undefined
    onGeneralCallerChange(caller: SMSCaller) {
        this.nxStore.dispatch(SMSActions.setGeneralCaller({ caller }))
    }

    // ngrx -- auto transmission
    public membershipAutoSendSetting$ = this.nxStore.select(SMSSelector.membershipAutoSendSetting)
    public lockerAutoSendSetting$ = this.nxStore.select(SMSSelector.lockerAutoSendSetting)
    public membershipAutoSendSetting: SMSAutoSend = FromSMS.SMSAutoSendInit
    public lockerAutoSendSetting: SMSAutoSend = FromSMS.SMSAutoSendInit
    public membershipAutoSendSettingTextByte = 0
    public lockerAutoSendSettingTextByte = 0
    public membershipCaller$ = this.nxStore.select(SMSSelector.membershipCaller)
    public membershipCaller: SMSCaller = undefined
    public lockerCaller$ = this.nxStore.select(SMSSelector.lockerCaller)
    public lockerCaller: SMSCaller = undefined
    onLockerCallerChange(caller: SMSCaller) {
        this.nxStore.dispatch(SMSActions.setLockerCaller({ caller }))
    }
    onMembershipCallerChange(caller: SMSCaller) {
        this.nxStore.dispatch(SMSActions.setMembershipCaller({ caller }))
    }

    // ngrx -- history
    public historyGroupLoading: Loading = 'idle'
    public historyLoading: Loading = 'idle'
    public historyGroupLoading$ = this.nxStore.select(SMSSelector.historyGroupLoading)
    public historyLoading$ = this.nxStore.select(SMSSelector.historyLoading)
    public smsHistoryGroupList$ = this.nxStore.select(SMSSelector.smsHistoryGroupList)
    public smsHistoryList$ = this.nxStore.select(SMSSelector.smsHistoryList)
    public historyDateRange$ = this.nxStore.select(SMSSelector.historyDateRange)
    public selectedHistoryDate: [string, string] = [
        dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
        dayjs().format('YYYY-MM-DD'),
    ]
    public curHistoryGroup$ = this.nxStore.select(SMSSelector.curHistoryGroup)

    public unsubscribe$ = new Subject<boolean>()

    constructor(
        private nxStore: Store,
        private storageService: StorageService,
        private fb: FormBuilder,
        private wordService: WordService
    ) {}

    ngOnInit(): void {
        this.center = this.storageService.getCenter()

        this.nxStore.pipe(select(SMSSelector.curCenterId), take(1)).subscribe((curCenterId) => {
            if (curCenterId != this.center.id) {
                this.nxStore.dispatch(SMSActions.resetAll())
                this.nxStore.dispatch(SMSActions.startLoadMemberList({ centerId: this.center.id }))

                this.nxStore.dispatch(SMSActions.startGetMembershipAutoSend({ centerId: this.center.id }))
                this.nxStore.dispatch(SMSActions.startGetLockerAutoSend({ centerId: this.center.id }))
            } else {
                this.nxStore.dispatch(SMSActions.startRefreshMemberList({ centerId: this.center.id }))
            }
        })
        this.nxStore.dispatch(SMSActions.startGetSMSPoint({ centerId: this.center.id }))
        this.nxStore.dispatch(SMSActions.startGetUsersByCategory({ centerId: this.center.id }))
        this.nxStore.dispatch(SMSActions.setCurCenterId({ centerId: this.center.id }))
        this.nxStore.dispatch(SMSActions.startGetCallerList({ centerId: this.center.id }))

        this.historyDateRange$.pipe(takeUntil(this.unsubscribe$)).subscribe((dateRange) => {
            this.selectedHistoryDate = _.cloneDeep(dateRange)
        })
        this.nxStore.dispatch(
            SMSActions.startGetHistoryGroup({
                centerId: this.center.id,
                start_date: this.selectedHistoryDate[0],
                end_date: this.selectedHistoryDate[1],
            })
        )

        this.smsPoint$.pipe(takeUntil(this.unsubscribe$)).subscribe((smsPoint) => {
            this.smsPoint = smsPoint
            this.checkIsMsgAbleToBeSent()
            this.textCountForSMSPoint = {
                short: Math.floor(this.smsPoint / 11),
                long: Math.floor(this.smsPoint / 33),
            }
        })
        this.selectSMSType$.pipe(takeUntil(this.unsubscribe$)).subscribe((smsType) => {
            this.smsType = smsType
        })
        this.selectedUserListSelected$.pipe(takeUntil(this.unsubscribe$)).subscribe((selectedNumber) => {
            this.selectedUserListSelected = selectedNumber
            this.calculateSubtractPoint(this.generalTextByte, this.selectedUserListSelected)
            this.checkIsMsgAbleToBeSent()
        })
        this.callerList$.pipe(takeUntil(this.unsubscribe$)).subscribe((cl) => {})
        this.generalText$.pipe(takeUntil(this.unsubscribe$)).subscribe((gt) => {
            this.generalText = gt
            this.generalTextByte = this.wordService.getTextByte(gt)
            this.calculateSubtractPoint(this.generalTextByte, this.selectedUserListSelected)
            this.checkIsMsgAbleToBeSent()
        })
        this.historyLoading$.pipe(takeUntil(this.unsubscribe$)).subscribe((hl) => {
            this.historyLoading = hl
        })
        this.historyGroupLoading$.pipe(takeUntil(this.unsubscribe$)).subscribe((hgl) => {
            this.historyGroupLoading = hgl
        })
        this.membershipAutoSendSetting$.pipe(takeUntil(this.unsubscribe$)).subscribe((mass) => {
            this.membershipAutoSendSetting = _.cloneDeep(mass)
            this.membershipAutoSendSettingTextByte = this.wordService.getTextByte(this.membershipAutoSendSetting.text)
        })
        this.lockerAutoSendSetting$.pipe(takeUntil(this.unsubscribe$)).subscribe((lass) => {
            this.lockerAutoSendSetting = _.cloneDeep(lass)
            this.lockerAutoSendSettingTextByte = this.wordService.getTextByte(this.lockerAutoSendSetting.text)
        })
        this.bookDate$.pipe(takeUntil(this.unsubscribe$)).subscribe((bd) => {
            this.bookDate = bd
            this.bookDateText = dayjs(bd.date).format('YYYY.MM.DD (ddd)')
        })
        this.bookTime$.pipe(takeUntil(this.unsubscribe$)).subscribe((bt) => {
            this.bookTime = bt
        })
        this.generalTransmissionTime$.pipe(takeUntil(this.unsubscribe$)).subscribe((gtt) => {
            this.generalTransmissionTime = _.cloneDeep(gtt)
        })
        this.generalCaller$.pipe(takeUntil(this.unsubscribe$)).subscribe((gc) => {
            this.generalCaller = _.cloneDeep(gc)
            this.checkIsMsgAbleToBeSent()
        })

        // auto transmission
        this.lockerCaller$.pipe(takeUntil(this.unsubscribe$)).subscribe((lc) => {
            this.lockerCaller = _.cloneDeep(lc)
        })
        this.membershipCaller$.pipe(takeUntil(this.unsubscribe$)).subscribe((mc) => {
            this.membershipCaller = _.cloneDeep(mc)
        })
        // history
    }
    ngOnDestroy() {
        this.unsubscribe$.next(true)
        this.unsubscribe$.complete()
    }

    // message route : general
    public isMsgAbleToBeSent = true
    checkIsMsgAbleToBeSent() {
        this.isMsgAbleToBeSent =
            this.checkIsPointEnough() &&
            this.selectedUserListSelected > 0 &&
            !_.isEmpty(this.generalCaller) &&
            _.trim(this.generalText).length > 0
    }

    public isPointEnough = true
    checkIsPointEnough() {
        this.isPointEnough = this.smsPoint - this.subtractPoint >= 0
        return this.isPointEnough
    }

    calculateSubtractPoint(gtb: number, selectedUsers: number) {
        if (gtb <= 90) {
            this.subtractText = '단문 11P'
            this.subtractPoint = 11 * selectedUsers
        } else {
            this.subtractText = '장문 33P'
            this.subtractPoint = 33 * selectedUsers
        }
    }

    public generalTransmissionTime = {
        immediate: true,
        book: false,
    }
    onGeneralTransmissionTimeClick(type: 'immediate' | 'book') {
        if (type == 'immediate') {
            this.nxStore.dispatch(
                setGeneralTransmissionTime({
                    generalTransmissionTime: {
                        immediate: true,
                        book: false,
                    },
                })
            )
        } else if (type == 'book') {
            this.nxStore.dispatch(
                setGeneralTransmissionTime({
                    generalTransmissionTime: {
                        immediate: false,
                        book: true,
                    },
                })
            )
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
        this.nxStore.dispatch(SMSActions.setBookDate({ bookDate: data }))
    }

    public bookTime
    onBookTimeClick(time: { key: string; name: string }) {
        this.nxStore.dispatch(SMSActions.setBookTime({ bookTime: time.key }))
    }

    public showTransmitMsgModal = false
    public showTransmitMsgModalData = {
        text: `문자 ${this.selectedUserListSelected}건을 전송하시겠어요?`,
        subText: `전송하기 버튼을 클릭하시면
                문자가 즉시 또는 예약한 일시에 전송됩니다.`,
        cancelButtonText: '취소',
        confirmButtonText: '전송하기',
    }
    openTransmitMsgModal() {
        this.showTransmitMsgModal = true
        this.showTransmitMsgModalData.text = `문자 ${this.selectedUserListSelected}건을 전송하시겠어요?`
    }
    onCancelTransmitMsg() {
        this.showTransmitMsgModal = false
    }
    onConfirmTransmitMsg() {
        this.showTransmitMsgModal = false
        this.nxStore.dispatch(
            SMSActions.startSendGeneralMessage({
                centerId: this.center.id,
                cb: () => {
                    this.nxStore.dispatch(
                        SMSActions.startGetHistoryGroup({
                            centerId: this.center.id,
                            start_date: this.selectedHistoryDate[0],
                            end_date: this.selectedHistoryDate[1],
                        })
                    )
                    this.nxStore.dispatch(showToast({ text: '문자 전송이 완료되었습니다.' }))
                },
            })
        )
        // this.nxStore.dispatch(showToast({text:'문자 전송이 완료되었습니다.'}))
    }

    // message route : auto-transmission
    public membershipSettingObj = {
        settingTitle: '회원권 만기 시, 자동 전송 사용 여부',
        transType: '회원권',
    }
    public lockerSettingObj = {
        settingTitle: '락커 만기 시, 자동 전송 사용 여부',
        transType: '락커',
    }
    updateTransmitChange(isOn: boolean, type: AutoTransmitType) {
        if (type == 'membership') {
            this.nxStore.dispatch(
                SMSActions.startUpdateMembershipAutoSend({
                    centerId: this.center.id,
                    reqBody: { auto_send_yn: isOn },
                })
            )
        } else {
            this.nxStore.dispatch(
                SMSActions.startUpdateLockerAutoSend({
                    centerId: this.center.id,
                    reqBody: { auto_send_yn: isOn },
                })
            )
        }
    }
    updateTransmitDay(day: string, type: AutoTransmitType) {
        if (type == 'membership' && this.membershipAutoSendSetting.days != Number(day)) {
            this.nxStore.dispatch(
                SMSActions.startUpdateMembershipAutoSend({
                    centerId: this.center.id,
                    reqBody: { days: Number(day) },
                })
            )
        } else if (type == 'locker' && this.lockerAutoSendSetting.days != Number(day)) {
            this.nxStore.dispatch(
                SMSActions.startUpdateLockerAutoSend({
                    centerId: this.center.id,
                    reqBody: { days: Number(day) },
                })
            )
        }
    }
    updateTransmitTime(time: string, type: AutoTransmitType) {
        if (type == 'membership') {
            this.nxStore.dispatch(
                SMSActions.startUpdateMembershipAutoSend({
                    centerId: this.center.id,
                    reqBody: { time },
                })
            )
        } else {
            this.nxStore.dispatch(
                SMSActions.startUpdateLockerAutoSend({
                    centerId: this.center.id,
                    reqBody: { time },
                })
            )
        }
    }
    onMLCallerChange(caller: SMSCaller, type: AutoTransmitType) {
        if (type == 'membership') {
            this.nxStore.dispatch(
                SMSActions.startUpdateMembershipAutoSend({
                    centerId: this.center.id,
                    reqBody: { phone_number: caller.phone_number },
                })
            )
        } else {
            this.nxStore.dispatch(
                SMSActions.startUpdateLockerAutoSend({
                    centerId: this.center.id,
                    reqBody: { phone_number: caller.phone_number },
                })
            )
        }
    }
    onMLTextChange(text: string, type: AutoTransmitType) {
        if (_.isEmpty(_.trim(text))) return
        if (type == 'membership') {
            this.nxStore.dispatch(
                SMSActions.startUpdateMembershipAutoSend({
                    centerId: this.center.id,
                    reqBody: { text },
                })
            )
        } else {
            this.nxStore.dispatch(
                SMSActions.startUpdateLockerAutoSend({
                    centerId: this.center.id,
                    reqBody: { text },
                })
            )
        }
    }

    // message route : history

    onDateSelected(date: [string, string]) {
        console.log('onDateSelected : ', date)
        this.nxStore.dispatch(SMSActions.setHistoryDateRange({ historyDateRange: date }))
        this.nxStore.dispatch(
            SMSActions.startGetHistoryGroup({
                centerId: this.center.id,
                start_date: _.replace(date[0], '.', '-'),
                end_date: _.replace(date[1], '.', '-'),
                cb: () => {
                    this.nxStore.dispatch(showToast({ text: '내역 조회 기간이 변경되었습니다.' }))
                },
            })
        )
    }

    onHistoryGroupItemClick(hd: SMSHistoryGroup) {
        this.nxStore.dispatch(SMSActions.setSMSHistoryGroup({ smsHistoryGroup: hd }))
        this.nxStore.dispatch(
            SMSActions.startGetHistoryGroupDetail({ centerId: this.center.id, historyGroupId: hd.id })
        )
    }
}
