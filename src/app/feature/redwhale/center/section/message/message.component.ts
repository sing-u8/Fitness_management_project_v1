import { Component, OnInit } from '@angular/core'
import dayjs from 'dayjs'

// ngrx
import { Store } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'

type MessageRoute = 'general' | 'auto-transmission' | 'history'

@Component({
    selector: 'rw-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
    public messageRoute: MessageRoute = 'general'
    setMessageRoute(mr: MessageRoute) {
        this.messageRoute = mr
    }

    constructor(private nxStore: Store) {}

    ngOnInit(): void {}

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
