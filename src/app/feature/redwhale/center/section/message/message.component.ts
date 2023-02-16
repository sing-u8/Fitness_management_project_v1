import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'

import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

import _ from 'lodash'
// schema
import { Center } from '@schemas/center'

// services
import { StorageService } from '@services/storage.service'
import { WordService } from '@services/helper/word.service'
import { PaymentService } from '@services/payment.service'

// rxjs
import { Subject } from 'rxjs'
import { take, takeUntil } from 'rxjs/operators'

// ngrx
import { select, Store } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'

import * as FromSMS from '@centerStore/reducers/sec.sms.reducer'
import * as SMSSelector from '@centerStore/selectors/sec.sms.selector'
import * as SMSActions from '@centerStore/actions/sec.sms.actions'
import { setGeneralTransmissionTime } from '@centerStore/actions/sec.sms.actions'
import { Loading } from '@schemas/store/loading'
import { SMSAutoSend } from '@schemas/sms-auto-send'
import { SMSCaller } from '@schemas/sms-caller'
import { SMSHistoryGroup } from '@schemas/sms-history-group'
import { ClickEmitterType } from '@schemas/components/button'

type AutoTransmitType = 'membership' | 'locker'

@Component({
    selector: 'rw-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, OnDestroy {
    public readonly pointPerMsg = {
        short: 12,
        long: 32,
    }

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
    public callerListErrText = ''
    public generalIsAdSet$ = this.nxStore.select(SMSSelector.generalIsAdSet)
    public generalIsAdSet = false
    onSetGeneralAdSetClick() {
        this.nxStore.dispatch(SMSActions.setIsAdSet({ isAd: !this.generalIsAdSet }))
    }
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

    public adMegObj = FromSMS.adMsgObj
    public adMsgRef = FromSMS.adMsgRef

    // ngrx -- history
    public historyGroupLoading: Loading = 'idle'
    public historyLoading: Loading = 'idle'
    public historyGroupLoading$ = this.nxStore.select(SMSSelector.historyGroupLoading)
    public historyLoading$ = this.nxStore.select(SMSSelector.historyLoading)
    public smsHistoryGroupList$ = this.nxStore.select(SMSSelector.smsHistoryGroupList)
    public smsHistoryList$ = this.nxStore.select(SMSSelector.smsHistoryList)
    public historyDateRange$ = this.nxStore.select(SMSSelector.historyDateRange)
    public selectedHistoryDate: FromSMS.HistoryDateRange = undefined
    public curHistoryGroup$ = this.nxStore.select(SMSSelector.curHistoryGroup)

    public unsubscribe$ = new Subject<boolean>()

    constructor(
        private nxStore: Store,
        private storageService: StorageService,
        private fb: FormBuilder,
        private wordService: WordService,
        private paymentService: PaymentService
    ) {}

    ngOnInit(): void {
        this.center = this.storageService.getCenter()
        this.adMegObj.top = '(광고) ' + this.center.name + ' 센터'

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

        this.selectedHistoryDate = this.getDateRange(this.selectedHistoryDate)
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
                short: Math.floor(this.smsPoint / this.pointPerMsg.short),
                long: Math.floor(this.smsPoint / this.pointPerMsg.long),
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
        this.callerList$.pipe(takeUntil(this.unsubscribe$)).subscribe((v) => {
            if (v.callerList.length == 0 && v.isCallerListInit) {
                this.showRegisterSenderPhone = true
                this.setRegisterSenderPhoneType('contain')
                // this.callerListErrText = '선택할 수 있는 발신번호가 없습니다.'
            } else {
                this.callerListErrText = ''
            }
        })

        this.generalIsAdSet$.pipe(takeUntil(this.unsubscribe$)).subscribe((isAd) => {
            this.generalIsAdSet = isAd
            this.generalTextByte = this.wordService.getTextByte(
                this.generalIsAdSet ? FromSMS.getTextWithAd(this.generalText) : this.generalText
            )
        })
        this.generalText$.pipe(takeUntil(this.unsubscribe$)).subscribe((gt) => {
            this.generalText = gt
            this.generalTextByte = this.wordService.getTextByte(this.generalIsAdSet ? FromSMS.getTextWithAd(gt) : gt)
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
            this.subtractText = `단문 ${this.pointPerMsg.short}P`
            this.subtractPoint = this.pointPerMsg.short * selectedUsers
        } else {
            this.subtractText = `장문 ${this.pointPerMsg.long}P`
            this.subtractPoint = this.pointPerMsg.long * selectedUsers
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

    public showNotTransmitableModal = false
    public showNotTransmitableModalData = {
        text: `오후 9시부터 다음날 오전 8시 사이에는
                문자를 전송할 수 없어요. 😞`,
        subText: `정보통신망법에 따라, 별도의 동의 없이 야간 시간에
                문자를 전송할 경우 과태료가 부과됩니다.`,
        cancelButtonText: '확인',
        confirmButtonText: '전송 시간 변경하기',
    }
    onCancelNotTransmitableModal() {
        this.showNotTransmitableModal = false
    }
    onConfirmNotTransmitableModal() {
        this.showNotTransmitableModal = false
        this.onGeneralTransmissionTimeClick('book')
    }

    checkTransmitAvailable() {
        const isTransmitable = dayjs().isBetween(
            dayjs().set('hour', 8).set('minute', 0).set('second', 0),
            dayjs().set('hour', 21).set('minute', 0).set('second', 0),
            'minute',
            '[]'
        )
        console.log('checkTransmitAvailable - ', isTransmitable)
        if (isTransmitable) {
            this.openTransmitMsgModal()
        } else {
            this.showNotTransmitableModal = true
        }
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
        // if (_.isEmpty(_.trim(text))) return
        if (type == 'membership') {
            this.nxStore.dispatch(
                SMSActions.startUpdateMembershipAutoSend({
                    centerId: this.center.id,
                    reqBody: { text: text },
                })
            )
        } else {
            this.nxStore.dispatch(
                SMSActions.startUpdateLockerAutoSend({
                    centerId: this.center.id,
                    reqBody: { text: text },
                })
            )
        }
    }

    // message route : history

    onDateSelected(date: FromSMS.HistoryDateRange) {
        const _date = this.getDateRange(date)
        this.nxStore.dispatch(SMSActions.setHistoryDateRange({ historyDateRange: date }))
        this.nxStore.dispatch(
            SMSActions.startGetHistoryGroup({
                centerId: this.center.id,
                start_date: _date[0],
                end_date: _date[1],
                cb: () => {
                    this.nxStore.dispatch(showToast({ text: '내역 조회 기간이 변경되었습니다.' }))
                },
            })
        )
    }

    getDateRange(date: FromSMS.HistoryDateRange): [string, string] {
        let start: string = undefined
        let end: string = undefined
        if (_.isArray(date)) {
            start = date[0]
            end = date[1]
        } else if (_.isString(date)) {
            start = date
        }
        if (!end) {
            const dateList = _.map(_.split(start, '.'), _.parseInt)
            if (dateList.length == 2) {
                start = dayjs(new Date(dateList[0], dateList[1] - 1, 1)).format('YYYY-MM-DD')
                end = dayjs(new Date(dateList[0], dateList[1], 0)).format('YYYY-MM-DD')
            } else if (dateList.length == 3) {
                start = dayjs(new Date(dateList[0], dateList[1] - 1, dateList[2])).format('YYYY-MM-DD')
                end = dayjs(new Date(dateList[0], dateList[1] - 1, dateList[2])).format('YYYY-MM-DD')
            }
        } else {
            const _startDateList = _.map(_.split(start, '.'), _.parseInt)
            start = dayjs(new Date(_startDateList[0], _startDateList[1] - 1, _startDateList[2])).format('YYYY-MM-DD')
            const _endDateList = _.map(_.split(end, '.'), _.parseInt)
            end = dayjs(new Date(_endDateList[0], _endDateList[1] - 1, _endDateList[2])).format('YYYY-MM-DD')
        }
        return [start, end]
    }

    onHistoryGroupItemClick(hd: SMSHistoryGroup) {
        this.nxStore.dispatch(SMSActions.setSMSHistoryGroup({ smsHistoryGroup: hd }))
        this.nxStore.dispatch(
            SMSActions.startGetHistoryGroupDetail({ centerId: this.center.id, historyGroupId: hd.id })
        )
    }

    // chargePoint complete modal
    public showChargePointCompleteModal = false
    onShowChargePointCompleteConfirm() {
        this.showChargePointCompleteModal = false
    }
    public chargedData = {
        point: 0,
        curPoint: 0,
        pay: 0,
    }
    public chargeType = '카드'

    // charge point modal vars & funcs
    public showChargePointModal = false
    toggleChargePointModal() {
        this.showChargePointModal = !this.showChargePointModal
    }
    onChargePointCancel() {
        this.showChargePointModal = false
    }
    onChargePointChargeConfirm(res: { loadingFns: ClickEmitterType; amount: number; point: number }) {
        this.paymentService
            .createPaymentData({
                center_id: this.center.id,
                product_type_code: 'import_payment_product_type_sms_point',
                amount: res.amount, // res.amount,
            })
            .subscribe((v) => {
                const user = this.storageService.getUser()
                const IMP = window['IMP']
                console.log('onChargePointChargeConfirm : ', IMP, ' --- ', v)

                IMP.init('imp46444316')
                IMP.request_pay(
                    {
                        pg: 'uplus',
                        pay_method: 'card',
                        merchant_uid: v.merchant_uid,
                        name: '문자 포인트 충전',
                        amount: res.amount, // v.amount,
                        buyer_email: user.email,
                        buyer_name: user.name,
                        buyer_tel: user.phone_number,
                    },
                    (rsp) => {
                        if (rsp.success) {
                            this.paymentService
                                .validatePaymentDataAndSave({
                                    imp_uid: rsp.imp_uid,
                                    merchant_uid: rsp.merchant_uid,
                                })
                                .subscribe(() => {
                                    this.showChargePointCompleteModal = true
                                    this.chargedData = {
                                        point: res.point,
                                        curPoint: this.smsPoint,
                                        pay: res.amount,
                                    }
                                    this.chargeType = '카드'

                                    this.nxStore.dispatch(SMSActions.startGetSMSPoint({ centerId: this.center.id }))
                                    this.showChargePointModal = false
                                    res.loadingFns.hideLoading()
                                })
                        } else {
                            console.log('결제에 실패하였습니다. 에러 내용: ' + rsp.error_msg)
                            this.showChargePointModal = false
                            res.loadingFns.hideLoading()
                        }
                    }
                )
            })
    }

    // register sender phone modal vars & funcs
    public showRegisterSenderPhone = false
    public registerSenderPhoneData = {
        text: '문자 전송을 위해\n' + '발신번호 등록을 신청해주세요.',
        subText: '전기통신사업법 제84조 2에 따라\n' + '문자를 보내고자 할 경우 사전에 발신번호 등록이 필요해요.',
        confirmButtonText: '등록 신청하기',
    }
    public registerSenderPhoneType: 'cover' | 'contain' = 'cover'
    setRegisterSenderPhoneType(type: 'cover' | 'contain') {
        this.registerSenderPhoneType = type
    }
    toggleRegisterSenderPhone() {
        this.showRegisterSenderPhone = !this.showRegisterSenderPhone
    }
    onRegisterSenderPhoneCancel() {
        this.showRegisterSenderPhone = false
    }
    onRegisterSenderPhoneConfirm() {
        this.showRegisterSenderPhone = false
    }
    // onRegisterSenderPhoneConfirm(res: { loadingFns: ClickEmitterType; data: { name: string; phone: string } }) {
    //     res.loadingFns.showLoading()
    //     this.nxStore.dispatch(
    //         SMSActions.startRegisterCallingNumber({
    //             reqBody: {
    //                 phone_number: res.data.phone,
    //             },
    //             cb: () => {
    //                 this.nxStore.dispatch(showToast({ text: '발신번호 등록 요청이 완료되었습니다.' }))
    //                 this.nxStore.dispatch(SMSActions.startGetCallerList({ centerId: this.center.id }))
    //                 res.loadingFns.hideLoading()
    //                 this.showRegisterSenderPhone = false
    //             },
    //         })
    //     )
    // }
}
