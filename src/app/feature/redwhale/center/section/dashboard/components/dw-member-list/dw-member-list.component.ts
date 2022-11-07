import { Component, OnInit, Input, Output, OnDestroy, EventEmitter } from '@angular/core'
import { FormBuilder, FormControl, ValidationErrors, AsyncValidatorFn, AbstractControl } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'

import _ from 'lodash'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
dayjs.locale('ko')

import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { Loading } from '@schemas/store/loading'
import { HoldingConfirmOutput } from '@schemas/components/hold-all-modal'

import { StorageService } from '@services/storage.service'

// rxjs
import { Subject, Observable } from 'rxjs'
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators'

// ngrx
import { Store, select } from '@ngrx/store'

import * as FromDashboard from '@centerStore/reducers/sec.dashboard.reducer'
import * as DashboardSelector from '@centerStore/selectors/sec.dashboard.selector'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import { setDrawerCurUser } from '@centerStore/actions/sec.dashboard.actions'

@Component({
    selector: 'dw-member-list',
    templateUrl: './dw-member-list.component.html',
    styleUrls: ['./dw-member-list.component.scss'],
})
export class DwMemberListComponent implements OnInit, OnDestroy {
    @Input() usersLists: FromDashboard.UsersLists = _.cloneDeep(FromDashboard.UsersListInit)
    @Input() searchedUsersLists: FromDashboard.UsersLists = _.cloneDeep(FromDashboard.UsersListInit)
    @Input() usersSelectCateg: FromDashboard.UsersSelectCateg = _.cloneDeep(FromDashboard.UsersSelectCategInit)
    @Input() selectedUserList: FromDashboard.UserListSelect = _.cloneDeep(FromDashboard.UserListSelectInit)
    @Input() curUserData: FromDashboard.CurUserData = _.cloneDeep(FromDashboard.CurUserDataInit)
    @Input() selectedUserListsHolding = 0
    @Input() isLoading: Loading = 'idle'

    @Output() onUserCardClick = new EventEmitter<void>()

    public employeeRoleObj$ = this.nxStore.select(DashboardSelector.drawerEmployeeRoleObj)

    public center: Center

    public doShowHoldPartialModal = false
    public holdModeFlags = false
    openPartialHoldModal() {
        this.doShowHoldPartialModal = true
    }
    closePartialHoldModal() {
        this.doShowHoldPartialModal = false
    }
    onHoldPartialCancel() {
        this.closePartialHoldModal()
    }
    onHoldPartialConfirm(event: HoldingConfirmOutput) {
        this.nxStore.dispatch(
            DashboardActions.startDrawerCenterHolding({
                centerId: this.center.id,
                reqBody: {
                    start_date: event.date.startDate,
                    end_date: event.date.endDate,
                    user_locker_included: event.holdWithLocker,
                },
                cb: () => {
                    this.closePartialHoldModal()
                    this.toggleHodlingMode()
                    event.loadingFns.hideLoading()
                    if (!_.isEmpty(this.dbCurCenterId) && !_.isEmpty(this.dbCurUserData.user)) {
                        this.nxStore.dispatch(
                            DashboardActions.startGetUserData({
                                centerId: this.center.id,
                                centerUser: this.dbCurUserData.user,
                            })
                        )
                    }
                },
            })
        )
    }
    toggleHodlingMode() {
        this.holdModeFlags = !this.holdModeFlags
        this.resetSelectedCategListHold()
        this.holdAll = false
    }
    resetSelectedCategListHold() {
        this.nxStore.dispatch(
            DashboardActions.resetDrawerUsersListsHoldSelected({ memberSelectCateg: this.selectedUserList.key })
        )
    }

    public today: string = dayjs().format('YYYY.MM.DD (ddd)')

    public userSearchInput: FormControl
    public userSearchInput$_: string
    searchMemberValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return control.valueChanges.pipe(
                distinctUntilChanged(),
                map((value) => {
                    this.nxStore.dispatch(DashboardActions.setDrawerUserSearchInput({ searchInput: value as string }))
                    return null
                })
            )
        }
    }
    public unsubscribe$ = new Subject<void>()

    public dbCurCenterId$ = this.nxStore.select(DashboardSelector.curCenterId)
    public dbCurCenterId = undefined
    public dbCurUserData$ = this.nxStore.select(DashboardSelector.curUserData)
    public dbCurUserData = FromDashboard.CurUserDataInit

    constructor(
        private nxStore: Store,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private storageService: StorageService
    ) {
        this.center = this.storageService.getCenter()
        this.nxStore
            .pipe(select(DashboardSelector.drawerSearchInput), takeUntil(this.unsubscribe$))
            .subscribe((searchInput) => {
                this.userSearchInput$_ = _.clone(searchInput)
            })
        this.userSearchInput = this.fb.control(this.userSearchInput$_, {
            asyncValidators: [this.searchMemberValidator()],
        })

        this.dbCurCenterId$.pipe(takeUntil(this.unsubscribe$)).subscribe((dbCurCenterId) => {
            this.dbCurCenterId = dbCurCenterId
        })
        this.dbCurUserData$.pipe(takeUntil(this.unsubscribe$)).subscribe((dbCurUserData) => {
            this.dbCurUserData = dbCurUserData
        })
    }

    ngOnInit(): void {}
    ngOnDestroy(): void {
        this.unsubscribe$.next()
        this.unsubscribe$.complete()
    }

    // user-list-card method
    onCardClick(cardInfo: CenterUser) {
        this.nxStore.dispatch(DashboardActions.setDrawerCurUser({ centerUser: cardInfo }))
        this.onUserCardClick.emit()
    }
    onPartialHoldClick(holdFlag: boolean, index: number) {
        this.nxStore.dispatch(
            DashboardActions.setDrawerUsersListsHoldSelected({
                memberSelectCateg: this.selectedUserList.key,
                index: index,
                holdFlag: !holdFlag,
            })
        )
    }

    public holdAll = false
    onHoldAll() {
        this.holdAll = !this.holdAll
        this.nxStore.dispatch(
            DashboardActions.setDrawerAllUserListHold({
                memberSelectCateg: this.selectedUserList.key,
                holdFlag: this.holdAll,
            })
        )
    }

    // -------------------------------------- selectedUserList method --------------------------------------
    onSelectedUserListChange(type: string) {
        this.nxStore.dispatch(
            DashboardActions.startGetDrawerUserList({
                centerId: this.center.id,
                categ_type: type as FromDashboard.MemberSelectCateg,
            })
        )
        // this.nxStore.dispatch(DashboardActions.setUserListSelect({ userListSelect: this.selectedUserList }))
        // 해당 타입 userList 초기화 하기
    }

    public emptyGuideText: Record<
        FromDashboard.MemberSelectCateg,
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
        FromDashboard.MemberSelectCateg,
        {
            showTopImage?: boolean
            texts: string[]
            button?: {
                text: string
                func: () => void
            }
        }
    > = {
        member: {
            showTopImage: true,
            texts: ['검색하신 회원을 찾을 수 없습니다.', '검색어를 다시 확인해주세요!'],
            // button: {
            //     text: '신규 회원 등록하기',
            //     func: () => {
            //         this.goToRegisterNewMember()
            //     },
            // },
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
            // button: {
            //     text: '직원 등록하기',
            //     func: () => {
            //         this.goToRegisterNewMember()
            //     },
            // },
        },
    }
}
