import { Component, OnInit, Input, AfterViewInit } from '@angular/core'

@Component({
    selector: 'hp-function-box',
    templateUrl: './function-box.component.html',
    styleUrls: ['./function-box.component.scss'],
})
export class FunctionBoxComponent implements OnInit, AfterViewInit {
    @Input() type: 'm-member' | 'm-schedule' | 'r-class' | 'm-sale' | 'm-locker' | 'chat'

    public title = ''
    public desc = { first: '', second: '' }
    public url = ''
    constructor() {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        if (this.type == 'm-member') {
            this.title = '회원 관리'
            this.desc = { first: '단 한 명의 회원도', second: '놓치지 마세요.' }
            this.url = '/assets/homepage/icons/member-management.svg'
        } else if (this.type == 'm-sale') {
            this.title = '매출 관리'
            this.desc = { first: '센터 매출을', second: '한 번에 조회해 보세요.' }
            this.url = '/assets/homepage/icons/sale-management.svg'
        } else if (this.type == 'm-schedule') {
            this.title = '스케줄 관리'
            this.desc = { first: '주요 일정을', second: '알림으로 알려드려요.' }
            this.url = '/assets/homepage/icons/schedule-management.svg'
        } else if (this.type == 'm-locker') {
            this.title = '락커 관리'
            this.desc = { first: '센터 락커 구조 그대로', second: '배치할 수 있어요.' }
            this.url = '/assets/homepage/icons/locker-management.svg'
        } else if (this.type == 'chat') {
            this.title = '채팅'
            this.desc = { first: '유료 문자 대신', second: '무료 채팅을 이용하세요.' }
            this.url = '/assets/homepage/icons/chat.svg'
        } else if (this.type == 'r-class') {
            this.title = '수업 예약'
            this.desc = { first: '실시간으로 수업을', second: '예약할 수 있어요.' }
            this.url = '/assets/homepage/icons/lesson-reservation.svg'
        }
    }
}
