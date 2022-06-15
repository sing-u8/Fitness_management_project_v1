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
    AfterViewInit,
} from '@angular/core'
import _ from 'lodash'

import { Subject, Observable } from 'rxjs'
import { distinctUntilChanged, debounceTime, map } from 'rxjs/operators'
import { FormBuilder, FormControl, ValidationErrors, AsyncValidatorFn, AbstractControl } from '@angular/forms'

import { CenterUsersService } from '@services/center-users.service'
import { StorageService } from '@services/storage.service'

import { CenterUser } from '@schemas/center-user'
import { ChatRoomUser } from '@schemas/chat-room-user'
import { User } from '@schemas/user'
import { Center } from '@schemas/center'

type UserList = Array<{ show: boolean; selected: boolean; user: CenterUser; joinedAlready: boolean }>

@Component({
    selector: 'rw-invite-room-modal',
    templateUrl: './invite-room-modal.component.html',
    styleUrls: ['./invite-room-modal.component.scss'],
})
export class InviteRoomModalComponent implements AfterViewChecked, OnChanges, OnDestroy, AfterViewInit {
    @Input() visible: boolean
    @Input() mode: 'invite' | 'create'
    @Input() roomUserList: Array<ChatRoomUser> = []

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<void>()
    @Output() confirm = new EventEmitter<Array<CenterUser>>()

    public searchInput: FormControl
    public userList: UserList = []
    public selectedNum = 0

    changed: boolean

    public gym: Center
    public user: User

    public isMouseModalDown: boolean

    public unsubscribe$ = new Subject<void>()

    public modalTitle = {
        display: '',
        options: {
            invite: '채팅방에 초대할 회원을 선택해주세요.',
            create: '새로운 채팅에 초대할 회원을 선택해주세요.',
        },
    }

    constructor(
        private el: ElementRef,
        private centerUsersService: CenterUsersService,
        private storageService: StorageService,
        private renderer: Renderer2,
        private fb: FormBuilder
    ) {
        this.gym = this.storageService.getCenter()
        this.user = this.storageService.getUser()
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
                this.modalTitle.display = this.modalTitle.options[this.mode]
                if (this.mode == 'create') {
                    this.getMemberList()
                }
            }
        }

        if (this.mode == 'invite' && changes['roomUserList'] && !changes['roomUserList'].firstChange) {
            this.getMemberList()
        }
    }
    ngAfterViewInit() {
        this.getMemberList()
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

    onCancel(): void {
        this.cancel.emit()
        this.searchInput.setValue('')
        // this.userList = []
        this.selectedNum = 0
    }

    onConfirm(): void {
        const selectedUserList = this.getSelectedMemberList()
        this.confirm.emit(selectedUserList)
        this.searchInput.setValue('')
        // this.userList = []
        this.selectedNum = 0
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
    // ----------------------------- get member lsit func
    getMemberList() {
        // !! 매번 열 때마다 초기회 때문에 체크가 날라가는 경우가 있음
        this.centerUsersService.getUserList(this.gym.id, '', '', '').subscribe((users) => {
            this.userList = users
                .reverse()
                .map((user) => {
                    return { show: true, selected: false, user: user, joinedAlready: false }
                })
                .filter((listData) => listData.user.id != this.user.id)
            this.checkMemberJoined()
        })
    }

    checkMemberJoined() {
        if (!(this.mode == 'invite' && this.roomUserList.length > 0)) return
        this.roomUserList.forEach((roomUser) => {
            const idx = this.userList.findIndex((userData) => {
                if (roomUser.id == userData.user.id) {
                    return roomUser.id == userData.user.id
                } else {
                    return false
                }
            })

            idx != -1 ? (this.userList[idx].joinedAlready = true) : null
        })
    }

    getSelectedMemberList(): Array<CenterUser> {
        return this.userList.filter((member) => member.selected).map((selectedMem) => selectedMem.user)
    }
    // ------------------------------
    onCardClick(idx: number) {
        this.userList[idx].selected = !this.userList[idx].selected
        this.selectedNum = 0
        this.userList.forEach((user) => {
            this.selectedNum += user.selected ? 1 : 0
        })
    }

    setShowUserList(value: string) {
        this.userList.forEach((user, idx) => {
            user.user.center_user_name.includes(value) || user.user.phone_number.includes(value)
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
