import { Component, OnInit, Input, Output, OnDestroy, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'
import { FormBuilder, FormControl, ValidationErrors, AsyncValidatorFn, AbstractControl } from '@angular/forms'

import _ from 'lodash'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
dayjs.locale('ko')

import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { Loading } from '@schemas/store/loading'

// rxjs
import { Subject, Observable } from 'rxjs'
import { distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators'

import { StorageService } from '@services/storage.service'

// ngrx
import { Store, select } from '@ngrx/store'

import * as FromSMS from '@centerStore/reducers/sec.sms.reducer'
import * as SMSSelector from '@centerStore/selectors/sec.sms.selector'
import * as SMSActions from '@centerStore/actions/sec.sms.actions'

@Component({
    selector: 'msg-member-list',
    templateUrl: './msg-member-list.component.html',
    styleUrls: ['./msg-member-list.component.scss'],
})
export class MsgMemberListComponent implements OnInit, OnDestroy, OnChanges {
    @Input() usersLists: FromSMS.UsersLists = _.cloneDeep(FromSMS.UsersListInit)
    @Input() searchedUsersLists: FromSMS.UsersLists = _.cloneDeep(FromSMS.UsersListInit)
    @Input() usersSelectCateg: FromSMS.UsersSelectCateg = _.cloneDeep(FromSMS.UsersSelectCategInit)
    @Input() selectedUserList: FromSMS.UserListSelect = _.cloneDeep(FromSMS.UserListSelectInit)
    @Input() selectedUserListsSelected = 0
    @Input() isLoading: Loading = 'idle'
    @Input() includeAd: boolean

    public userSearchInput: FormControl
    public userSearchInput$_: string
    searchMemberValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return control.valueChanges.pipe(
                distinctUntilChanged(),
                map((value) => {
                    this.nxStore.dispatch(SMSActions.setUserSearchInput({ searchInput: value as string }))
                    return null
                })
            )
        }
    }

    public unsubscribe$ = new Subject<void>()

    constructor(private nxStore: Store, private storageService: StorageService, private fb: FormBuilder) {
        this.center = this.storageService.getCenter()
        this.nxStore.pipe(select(SMSSelector.searchInput), takeUntil(this.unsubscribe$)).subscribe((searchInput) => {
            this.userSearchInput$_ = _.clone(searchInput)
        })
        this.userSearchInput = this.fb.control(this.userSearchInput$_, {
            asyncValidators: [this.searchMemberValidator()],
        })
    }

    public center: Center

    ngOnInit(): void {}
    ngOnChanges(changes: SimpleChanges) {
        if (changes['includeAd'] && !changes['includeAd'].firstChange && changes['includeAd'].currentValue == true) {
            this.openAdToast()
        }
    }

    ngOnDestroy() {}

    public adToastText = `광고성 문자 전송 시에 한해, 광고성 문자 수신을
                거부한 회원은 선택하실 수 없어요.`
    public adToastShow = false
    closeAdToast() {
        this.adToastShow = false
    }
    openAdToast() {
        this.adToastShow = true
    }

    onCardClick(selected: boolean, index: number) {
        this.nxStore.dispatch(
            SMSActions.setUsersListsSelected({
                memberSelectCateg: this.selectedUserList.key,
                index: index,
                selected: !selected,
            })
        )
    }

    public selectAll = false
    onSelectAll() {
        this.selectAll = !this.selectAll
        this.nxStore.dispatch(
            SMSActions.setAllUserListSelected({
                memberSelectCateg: this.selectedUserList.key,
                selected: this.selectAll,
            })
        )
    }
    // ---- reset member selected vars and methods ------------
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
        this.changeSelectedUserList()
    }

    // -------------------------------------- selectedUserList method --------------------------------------
    public selectedUserListType: FromSMS.MemberSelectCateg = undefined
    onSelectedUserListChange(type: string) {
        this.selectedUserListType = type as FromSMS.MemberSelectCateg
        if (this.selectedUserListsSelected > 0) {
            this.openShowResetModal()
        } else {
            this.changeSelectedUserList()
        }
    }

    changeSelectedUserList() {
        this.selectAll = false
        this.nxStore.dispatch(
            SMSActions.startGetUserList({
                centerId: this.center.id,
                categ_type: this.selectedUserListType,
            })
        )
    }

    public today: string = dayjs().format('YYYY.MM.DD (ddd)')
    public emptyGuideText: Record<
        FromSMS.MemberSelectCateg,
        {
            today?: string
            title: string
            desc?: string[]
            emptyButton?: {
                text: string
                func: () => void
            }
        }
    > = {
        member: {
            title: '아직 등록된 회원이 없어요.',
            desc: ['센터에 회원을 등록해보세요!'],
        },
        attendance: {
            today: this.today,
            title: '아직 출석한 회원이 없어요.',
        },
        valid: {
            title: '유효한 회원이 없어요.',
            desc: ['센터에 회원을 등록해보세요!'],
        },
        unpaid: {
            today: this.today,
            title: '미수금이 있는 회원이 없어요.',
        },
        imminent: {
            today: this.today,
            title: '만료 예정인 회원이 없어요.',
        },
        expired: {
            today: this.today,
            title: '만료된 회원이 없어요.',
        },
        employee: {
            title: '등록된 직원이 없어요.',
            desc: ['회원으로 신규 등록하신 후, 권한을 직원으로', '변경하여 센터 직원을 추가해보세요!'],
        },
    }

    public emptySearchText: Record<
        FromSMS.MemberSelectCateg,
        {
            showTopImage?: boolean
            texts: string[]
        }
    > = {
        member: {
            showTopImage: true,
            texts: ['검색하신 회원을 찾을 수 없습니다.', '검색어를 다시 확인해주세요!'],
        },
        attendance: {
            texts: ['[오늘 출석한 회원] 내역에서 ', '검색하신 회원을 찾을 수 없습니다.'],
        },
        valid: {
            showTopImage: true,
            texts: ['[회원권 사용중인 회원] 내역에서 ', '검색하신 회원을 찾을 수 없습니다.'],
        },
        unpaid: {
            showTopImage: true,
            texts: ['[미수금이 있는 회원] 내역에서 ', '검색하신 회원을 찾을 수 없습니다.'],
        },
        imminent: {
            showTopImage: true,
            texts: ['[7일 내 만료 예정인 회원] 내역에서 ', '검색하신 회원을 찾을 수 없습니다.'],
        },
        expired: {
            showTopImage: true,
            texts: ['[만료된 회원] 내역에서 ', '검색하신 회원을 찾을 수 없습니다.'],
        },
        employee: {
            showTopImage: true,
            texts: ['검색하신 직원을 찾을 수 없습니다.', '검색어를 다시 확인해주세요!'],
        },
    }
}
