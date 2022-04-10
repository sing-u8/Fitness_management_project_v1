import { Component, Input, OnInit, OnChanges } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'

import _ from 'lodash'

import { CenterUser } from '@schemas/center-user'

// ngrx
import { Store } from '@ngrx/store'
import * as FromSchedule from '@centerStore/reducers/sec.schedule.reducer'
import * as ScheduleActoins from '@centerStore/actions/sec.schedule.actions'

@Component({
    selector: 'rw-sch-instructor-dropdown',
    templateUrl: './sch-instructor-dropdown.component.html',
    styleUrls: ['./sch-instructor-dropdown.component.scss'],
})
export class SchInstructorDropdownComponent implements OnInit, OnChanges {
    @Input() instructorList: Array<FromSchedule.InstructorType> = []

    public isContentOpen = true
    public selectedNum = 0
    public isAllChecked = true

    public isInit = false
    constructor(private nxStore: Store, private router: Router, private activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {}
    ngOnChanges(): void {
        if (this.instructorList && !this.isInit) {
            this.selectedNum = this.instructorList.length
        }
    }

    toggleContent() {
        this.isContentOpen = !this.isContentOpen
    }

    onCheckBoxSelect(idx: number) {
        this.instructorList[idx].selected = !this.instructorList[idx].selected
        this.selectedNum += this.instructorList[idx].selected == true ? 1 : -1
        this.checkIsAllChecked()
        this.isInit = true
        this.nxStore.dispatch(ScheduleActoins.setInstructorList({ instructorList: this.instructorList }))
    }

    onSelectButtonClick() {
        if (this.selectedNum == this.instructorList.length) {
            _.forEach(this.instructorList, (instructor) => {
                instructor.selected = false
            })
            this.selectedNum = 0
        } else {
            _.forEach(this.instructorList, (instructor) => {
                instructor.selected = true
            })
            this.selectedNum = this.instructorList.length
        }
        this.checkIsAllChecked()
        this.isInit = true
        this.nxStore.dispatch(ScheduleActoins.setInstructorList({ instructorList: this.instructorList }))
    }

    checkIsAllChecked() {
        this.isAllChecked = this.selectedNum == this.instructorList.length ? true : false
    }

    goToRegisterMember() {}

    //

    public noAddtionalInstructor = false
    public noAdditionanlInstructorData = {
        text: '더 이상 추가할 수 있는 강사가 없어요. 😥',
        subText: `강사의 정보로 회원 등록을 하신 후,
                회원관리 페이지에서 강사로 권한을 변경해주세요.`,
        cancelButtonText: '닫기',
        confirmButtonText: '회원관리로 이동',
    }
    toggleNoAdditionalInstructorModal() {
        this.noAddtionalInstructor = !this.noAddtionalInstructor
    }
    onCancelNoAddInst() {
        this.toggleNoAdditionalInstructorModal()
    }
    onConfirmNoAddInst() {
        this.toggleNoAdditionalInstructorModal()
        this.router.navigate(['./dashboard'], { relativeTo: this.activatedRoute })
    }

    // add instructor modal
    public addlInstructor = false
    public addlInstructorData = {
        text: '',
        subText: `추가된 강사는 센터 캘린더에
                    새로운 스케줄을 생성하고 삭제할 수 있어요.`,
        cancelButtonText: '취소',
        confirmButtonText: '강사 추가',
    }
    public willBeAddedInstructor: CenterUser = undefined
    toggleAddInstructorModal() {
        this.addlInstructor = !this.addlInstructor
    }
    onCancelAddInst() {
        this.toggleNoAdditionalInstructorModal()
    }
    onConfirmAddInst() {
        this.toggleNoAdditionalInstructorModal()
    }
}
