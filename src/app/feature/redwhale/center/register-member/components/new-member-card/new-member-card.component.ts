import { Component, OnInit, Input, Output, AfterViewInit, EventEmitter } from '@angular/core'

import { CenterUser } from '@schemas/center-user'

@Component({
    selector: 'new-member-card',
    templateUrl: './new-member-card.component.html',
    styleUrls: ['./new-member-card.component.scss'],
})
export class NewMemberCardComponent implements OnInit, AfterViewInit {
    @Input() cardIndex: number
    @Input() member: CenterUser
    @Input() memberLength: number
    @Input() registeredTime: string

    @Output() sendMemberData = new EventEmitter<CenterUser>()
    onClickCard() {
        this.sendMemberData.emit(this.member)
    }

    constructor() {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        //  시간 변환 func 추가하기
    }
}
