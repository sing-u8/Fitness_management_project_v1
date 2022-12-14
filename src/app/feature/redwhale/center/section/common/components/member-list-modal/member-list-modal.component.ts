import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    Renderer2,
    SimpleChanges,
    ViewChild,
} from '@angular/core'
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, ValidationErrors } from '@angular/forms'
import { EMPTY, Observable, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators'
import _ from 'lodash'

import { CenterUsersService } from '@services/center-users.service'
import { StorageService } from '@services/storage.service'

import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { Store } from '@ngrx/store'
import * as CenterCommonSelector from '@centerStore/selectors/center.common.selector'

@Component({
    selector: 'rw-member-list-modal',
    templateUrl: './member-list-modal.component.html',
    styleUrls: ['./member-list-modal.component.scss'],
})
export class MemberListModalComponent implements AfterViewChecked, OnChanges, AfterViewInit, OnDestroy {
    @Input() visible: boolean
    @Input() title = '회원 검색'
    @Input() searchPlaceholder = '회원의 이름 또는 전화번호를 검색해주세요.'
    @Input() filterFn: (centerUser: CenterUser) => boolean = (centerUser: CenterUser) => true

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<CenterUser>()

    public changed: boolean

    public center: Center

    public centerUsers: Array<CenterUser> = []
    public originMemberList: Array<CenterUser> = []
    public memberSearchInput: FormControl

    public isMouseModalDown: boolean

    public unsubscribe$ = new Subject<boolean>()

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private centerUsersService: CenterUsersService,
        private storageService: StorageService,
        private fb: FormBuilder,
        private nxStore: Store
    ) {
        this.center = this.storageService.getCenter()
        this.isMouseModalDown = false
        this.centerUsers = []
        this.memberSearchInput = this.fb.control('', { asyncValidators: [this.searchMemberValidator()] })
        this.nxStore
            .select(CenterCommonSelector.instructors)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((memberList) => {
                const memberListCopy = _.cloneDeep(memberList)
                this.centerUsers = this.filterMemberList(memberListCopy, this.memberSearchInput.value)
                this.originMemberList = memberListCopy.reverse()
            })
    }

    ngAfterViewInit(): void {
        // this.centerUsersService.getUserList(this.center.id, '', '').subscribe((memberList) => {
        //     this.centerUsers = memberList.reverse()
        // })
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && !changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
        if (changes['filterFn'] && this.originMemberList.length > 0) {
            this.centerUsers = this.filterMemberList(this.originMemberList, this.memberSearchInput.value)
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
    ngOnDestroy() {
        this.unsubscribe$.next(true)
        this.unsubscribe$.complete()
    }

    onCancel(): void {
        this.cancel.emit({})
    }

    onConfirm(member: CenterUser): void {
        this.confirm.emit(member)
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }

    searchMemberValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return control.valueChanges.pipe(
                distinctUntilChanged(),
                debounceTime(500),
                switchMap((v) => {
                    this.centerUsers = this.filterMemberList(this.originMemberList, v)
                    return EMPTY
                })
            )
        }
    }

    filterMemberList(memberList: CenterUser[], text: string) {
        return memberList.filter(this.filterFn).filter((item) => {
            return item.name.includes(text) || item.phone_number.includes(text)
        })
    }
}
