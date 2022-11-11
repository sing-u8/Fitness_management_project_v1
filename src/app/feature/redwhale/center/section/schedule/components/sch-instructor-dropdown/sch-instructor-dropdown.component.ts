import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

import _ from 'lodash'

import { WordService } from '@services/helper/word.service'
import { StorageService } from '@services/storage.service'

import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { Loading } from '@schemas/store/loading'

// ngrx
import { Store } from '@ngrx/store'
import * as FromSchedule from '@centerStore/reducers/sec.schedule.reducer'
import * as ScheduleActions from '@centerStore/actions/sec.schedule.actions'
import * as CenterCommonSelector from '@centerStore/selectors/center.common.selector'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { InstructorType } from '@centerStore/reducers/sec.schedule.reducer'
import { Calendar } from '@schemas/calendar'

@Component({
    selector: 'rw-sch-instructor-dropdown',
    templateUrl: './sch-instructor-dropdown.component.html',
    styleUrls: ['./sch-instructor-dropdown.component.scss'],
})
export class SchInstructorDropdownComponent implements OnInit, OnChanges, OnDestroy {
    @Input() instructorList: Array<FromSchedule.InstructorType> = []
    @Input() curCenterCalendar: Calendar
    @Input() loading: Loading = 'pending'

    public center: Center

    public isContentOpen = true
    public selectedNum = 0
    public isAllChecked = true

    public addableInstLength = 0
    public memberList: Array<CenterUser> = []
    public unsubscribe$ = new Subject<boolean>()

    public isInit = false
    constructor(
        private nxStore: Store,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private wordService: WordService,
        private storageService: StorageService
    ) {
        this.center = this.storageService.getCenter()
    }

    ngOnInit(): void {
        this.nxStore
            .select(CenterCommonSelector.members)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((memberList) => {
                this.memberList = memberList
            })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (this.instructorList && !this.isInit) {
            this.selectedNum = this.instructorList.length
        }
        if (changes['instructorList']) {
            this.instructorFilter = (cu: CenterUser) => {
                return cu.role_code != 'member' && _.every(this.instructorList, (inst) => inst.instructor.id != cu.id)
            }
            this.addableInstLength = _.filter(this.memberList, this.instructorFilter).length
        }
    }
    ngOnDestroy() {
        this.unsubscribe$.next(true)
        this.unsubscribe$.complete()
    }

    toggleContent() {
        this.isContentOpen = !this.isContentOpen
    }

    onCheckBoxSelect(idx: number) {
        this.instructorList[idx].selected = !this.instructorList[idx].selected
        this.selectedNum += this.instructorList[idx].selected == true ? 1 : -1
        this.checkIsAllChecked()
        this.isInit = true
        this.nxStore.dispatch(ScheduleActions.setInstructorList({ instructorList: this.instructorList }))
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
        this.nxStore.dispatch(ScheduleActions.setInstructorList({ instructorList: this.instructorList }))
    }

    checkIsAllChecked() {
        this.isAllChecked = this.selectedNum == this.instructorList.length
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
        this.router.navigate(['../dashboard'], { relativeTo: this.activatedRoute })
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
        this.toggleAddInstructorModal()
        this.willBeAddedInstructor = undefined
    }
    onConfirmAddInst() {
        this.toggleAddInstructorModal()
        this.nxStore.dispatch(
            ScheduleActions.startCreateInstructorFilter({
                centerId: this.center.id,
                centerCalendarId: this.curCenterCalendar.id,
                reqBody: {
                    instructor_user_id: this.willBeAddedInstructor.id,
                },
            })
        )
        this.willBeAddedInstructor = undefined
    }

    // add instructor list modal
    public addInstructorList = false
    toggleAddInstructorListModalIfPossible() {
        if (this.addableInstLength > 0) {
            this.addInstructorList = true
        } else {
            this.noInstructorModal = true
        }
    }
    onMemberListModalCancel() {
        this.addInstructorList = false
    }
    onMemberListModalConfirm(centerUser: CenterUser) {
        this.addInstructorList = false
        this.willBeAddedInstructor = centerUser
        this.addlInstructorData.text = `'${this.wordService.ellipsis(
            centerUser.center_user_name,
            6
        )}' 강사를 추가하시겠어요?`
        this.toggleAddInstructorModal()
    }

    public noInstructorModal = false
    public noInstructorModalData = {
        text: '더 이상 추가할 수 있는 강사가 없어요. 😥',
        subText: `강사의 정보로 회원 등록을 하신 후,
                회원관리 페이지에서 강사로 권한을 변경해주세요.`,
        cancelButtonText: '닫기',
        confirmButtonText: '회원관리로 이동',
    }
    onNoInstructorModalCancel() {
        this.noInstructorModal = false
    }
    onNoInstructorModalConfirm() {
        this.router.navigate(['../dashboard'], { relativeTo: this.activatedRoute })
    }

    public removeInstructorModal = false
    public removeInstructorModalData = {
        text: '',
        subText: `삭제 시, 해당 강사의 기존 일정이 모두 삭제되며
                다시 복구하실 수 없어요.`,
        cancelButtonText: '취소',
        confirmButtonText: '삭제하기',
    }
    public removeInstructor: CenterUser = undefined
    openRemoveInstructorModal(it: InstructorType) {
        this.removeInstructorModalData.text = `강사별 보기 목록에서
            ${it.instructor.name}님을 삭제하시겠어요?`
        this.removeInstructorModal = true
        this.removeInstructor = it.instructor
    }
    onRemoveInstructorModalCancel() {
        this.removeInstructorModal = false
    }
    onRemoveInstructorModalConfirm() {
        this.nxStore.dispatch(
            ScheduleActions.startRemoveInstructorFilter({ centerId: this.center.id, instructor: this.removeInstructor })
        )
        this.removeInstructorModal = false
    }

    instructorFilter(cu: CenterUser): boolean {
        return cu.role_code != 'member' && _.every(this.instructorList, (inst) => inst.instructor.id != cu.id)
    }
}
