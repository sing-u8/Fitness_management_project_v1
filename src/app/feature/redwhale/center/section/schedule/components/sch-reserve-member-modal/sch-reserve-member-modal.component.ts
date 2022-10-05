import {
    Component,
    Input,
    ElementRef,
    Renderer2,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    AfterViewChecked,
    ViewChild,
    OnDestroy,
} from '@angular/core'
import _ from 'lodash'

import { Subject, Observable } from 'rxjs'
import { distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators'
import { FormBuilder, FormControl, ValidationErrors, AsyncValidatorFn, AbstractControl } from '@angular/forms'

import { CenterCalendarService } from '@services/center-calendar.service'

import { CalendarTask } from '@schemas/calendar-task'
import { UserAbleToBook } from '@schemas/user-able-to-book'
import { Loading } from '@schemas/store/loading'

// ! 로딩 화면 추가할 필요가 있음
@Component({
    selector: 'rw-sch-reserve-member-modal',
    templateUrl: './sch-reserve-member-modal.component.html',
    styleUrls: ['./sch-reserve-member-modal.component.scss'],
})
export class SchReserveMemberModalComponent implements AfterViewChecked, OnChanges, OnDestroy {
    @Input() visible: boolean
    @Input() classTask: CalendarTask
    @Input() curCenterId: string
    @Input() responsiblityCalId: string
    @Input() bookedUserCount = 0

    @ViewChild('modalBackgroundElement') modalBackgroundElement: ElementRef
    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<{ usersAbleToBook: UserAbleToBook[] }>()

    public searchInput: FormControl
    public userList: Array<{ show: boolean; selected: boolean; user: UserAbleToBook }> = []
    public selectedNum = 0
    public isUserListLoading: Loading = 'idle'

    changed: boolean

    public isMouseModalDown: boolean

    public unsubscribe$ = new Subject<void>()

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private centerCalendarService: CenterCalendarService,
        private fb: FormBuilder
    ) {
        this.searchInput = this.fb.control('', {
            asyncValidators: [this.searchMemberValidator()],
        })
        this.isMouseModalDown = false
    }
    ngOnDestroy() {
        this.unsubscribe$.next()
        this.unsubscribe$.complete()
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && !changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
    }

    ngAfterViewChecked() {
        if (this.changed) {
            this.changed = false

            if (this.visible) {
                this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'display-block')
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)

                this.getValidMemberList()
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
            }
        }
    }

    onCancel(): void {
        this.cancel.emit({})
        this.searchInput.setValue('')
        this.userList = []
        this.selectedNum = 0
    }

    onConfirm(): void {
        const usersAbleToBook = this.userList.filter((user) => user.selected).map((user) => user.user)

        this.confirm.emit({ usersAbleToBook })
        this.searchInput.setValue('')
        this.userList = []
        this.selectedNum = 0
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
    // ----------------------------- get valid member lsit func
    getValidMemberList() {
        this.isUserListLoading = 'pending'
        this.centerCalendarService
            .getReservableUsers(this.curCenterId, this.responsiblityCalId, this.classTask.id)
            .subscribe((users) => {
                this.userList = users.map((user) => {
                    return { show: true, selected: false, user: user }
                })
                this.isUserListLoading = 'done'
            })
    }

    // ------------------------------
    onCardClick(idx: number) {
        if (
            this.userList[idx].selected == false &&
            this.classTask.class.capacity - this.bookedUserCount <= this.selectedNum
        )
            return
        this.userList[idx].selected = !this.userList[idx].selected
        this.selectedNum = 0
        this.userList.forEach((user) => {
            this.selectedNum += user.selected ? 1 : 0
        })
    }

    setShowUserList(value: string) {
        this.userList.forEach((user, idx) => {
            user.user.name.includes(value) || user.user.phone_number.includes(value)
                ? (this.userList[idx].show = true)
                : (this.userList[idx].show = false)
        })
    }

    searchMemberValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return control.valueChanges.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                map((value) => {
                    this.setShowUserList(value)
                    return null
                })
            )
        }
    }
}
