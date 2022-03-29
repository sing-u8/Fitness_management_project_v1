import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import dayjs from 'dayjs'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'
import { GymDashboardService } from '@services/gym-dashboard.service'
import {
    GymRegisterMembershipLockerStateService,
    Item,
    Locker,
    MembershipTicket,
} from '@services/etc/gym-register-membership-locker-state.service'
import { GetUserReturn } from '@schemas/gym-dashboard'

import { MembershipItem } from '@schemas/membership-item'
import { LockerItem } from '@schemas/locker-item'
import { LockerCategory } from '@schemas/locker-category'
import { Center } from '@schemas/center'
import _ from 'lodash'

@Component({
    selector: 'app-register-membership-locker',
    templateUrl: './register-membership-locker.component.html',
    styleUrls: ['./register-membership-locker.component.scss'],
})
export class RegisterMembershipLockerComponent implements OnInit, OnDestroy, AfterViewInit {
    public center: Center

    public user: GetUserReturn

    public today = dayjs().format('YYYY.MM.DD')

    public totalPriceInput = {
        cash: { price: '', name: '현금' },
        card: { price: '', name: '카드' },
        trans: { price: '', name: '계좌이체' },
        unpaid: { price: '', name: '미수금' },
    }

    public doShowMembershipListModal: boolean
    public doShowLockerSelectModal: boolean

    public selectedMembershipTicket: MembershipItem
    public selectedLocker: LockerItem
    public selectedLockerCategory: LockerCategory

    public itemList: Array<Item>
    public registerMlListSubscription: Subscription

    public totalPay = 0

    public samePrice = false
    public allItemDone = false

    public routerState

    // list 만들기

    constructor(
        private gymRegisterMlState: GymRegisterMembershipLockerStateService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private gymDashboardService: GymDashboardService,
        private storageService: StorageService,
        private globalService: GlobalService
    ) {
        console.log(
            'this.router.getCurrentNavigation().extras.state?.user as GetUserReturn: ',
            this.router.getCurrentNavigation()
        )

        this.routerState = this.router.getCurrentNavigation().extras.state
        this.center = this.storageService.getCenter()
        this.user = this.routerState?.user as GetUserReturn

        this.doShowLockerSelectModal = false
        this.doShowMembershipListModal = false

        this.registerMlListSubscription = this.gymRegisterMlState.selectItemList().subscribe((_itemList) => {
            this.itemList = _itemList
            this.totalPay = 0
            let doneNum = 0
            _.forEach(_itemList, (v, i) => {
                if (v.status == 'done') {
                    this.totalPay = this.totalPay + Number(v.price.replace(/[^0-9]/gi, ''))
                    doneNum++
                }
            })
            let _total = 0
            _.forIn(this.totalPriceInput, (value) => {
                _total += value.price ? Number(value.price.replace(/[^0-9]/gi, '')) : 0
            })
            this.samePrice = _total == this.totalPay ? true : false
            this.allItemDone = this.itemList.length == doneNum ? true : false
        })
    }

    ngOnInit(): void {
        if (!this.routerState) {
            this.backToDashboard()
        }
    }
    ngAfterViewInit(): void {}
    ngOnDestroy(): void {
        if (this.registerMlListSubscription) {
            this.gymRegisterMlState.resetChoseLockers()
            this.gymRegisterMlState.resetItemList()
            this.registerMlListSubscription.unsubscribe()
        }
    }
    // price input method
    restrictToNumber(event) {
        const code = event.which ? event.which : event.keyCode
        if (code < 48 || code > 57) {
            return false
        }
    }

    onInputKeyup(event, type: 'cash' | 'card' | 'unpaid' | 'trans') {
        if (event.code == 'Enter') return
        this.totalPriceInput[type].price = this.totalPriceInput[type].price
            .replace(/[^0-9]/gi, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')

        // set total
        let _total = 0
        _.forIn(this.totalPriceInput, (value) => {
            _total += value.price ? Number(value.price.replace(/[^0-9]/gi, '')) : 0
        })
        this.samePrice = _total == this.totalPay ? true : false
    }

    // routing function
    backToDashboard() {
        this.router.navigate(['../../'], { relativeTo: this.activatedRoute })
    }

    // register function
    registerMembershipLocker() {
        const reqBody = {
            membership: [],
            locker: [],
            pay_cash: Number(this.totalPriceInput.cash.price.replace(/[^0-9]/gi, '')),
            pay_card: Number(this.totalPriceInput.card.price.replace(/[^0-9]/gi, '')),
            pay_trans: Number(this.totalPriceInput.trans.price.replace(/[^0-9]/gi, '')),
            unpaid: Number(this.totalPriceInput.unpaid.price.replace(/[^0-9]/gi, '')),
            paid_date: this.today.split('.').reduce((pre, cur, idx) => {
                if (idx == 0) {
                    return pre + cur
                } else {
                    return pre + '-' + cur
                }
            }, ''),
        }
        _.forEach(this.itemList, (item) => {
            if (item.type == 'locker') {
                const _item = item as Locker
                const lockerItem = {
                    locker_item_id: Number(_item.locker.id),
                    start_date: _item.date.startDate,
                    end_date: _item.date.endDate,
                    price: Number(_item.price.replace(/[^0-9]/gi, '')),
                    assignee_id: _item.assignee.value.id,
                }
                reqBody.locker.push(lockerItem)
            } else if (item.type == 'membership') {
                const _item = item as MembershipTicket
                const membershipItem = {
                    membership_item_id: Number(_item.membershipItem.id),
                    lesson_item_ids: _.map(
                        _.filter(_item.lessonList, (lesson) => {
                            return lesson.selected
                        }),
                        (lesson) => {
                            return Number(lesson.item.id)
                        }
                    ),
                    start_date: _item.date.startDate,
                    end_date: _item.date.endDate,
                    count: Number(_item.count.count),
                    infinity_yn: _item.count.infinite ? 1 : 0,
                    price: Number(_item.price.replace(/[^0-9]/gi, '')),
                    assignee_id: _item.assignee.value.id,
                }
                reqBody.membership.push(membershipItem)
            }
        })

        console.log('registerMembershipLocker! : ', reqBody)

        this.gymDashboardService.registerTicket(this.center.id, this.user.id, reqBody).subscribe((_) => {
            console.log('registerTicket')
            this.router.navigate(['../../'], { relativeTo: this.activatedRoute, state: { registerML: true } })
            if (reqBody.membership.length > 0 && reqBody.locker.length > 0) {
                this.globalService.showToast(`${this.user.gym_user_name}님의 회원권 / 락커 등록이 완료되었습니다. `)
            } else if (reqBody.membership.length == 0 && reqBody.locker.length > 0) {
                this.globalService.showToast(`${this.user.gym_user_name}님의 락커 등록이 완료되었습니다. `)
            } else if (reqBody.membership.length > 0 && reqBody.locker.length == 0) {
                this.globalService.showToast(`${this.user.gym_user_name}님의 회원권 등록이 완료되었습니다. `)
            }
        })
    }

    // modal methods
    toggleLockerSelectModal() {
        this.doShowLockerSelectModal = !this.doShowLockerSelectModal
    }
    closeLockerSelectModal() {
        this.doShowLockerSelectModal = false
    }
    onLockerSelected(item: { locker: LockerItem; category: LockerCategory }) {
        this.gymRegisterMlState.create(this.gymRegisterMlState.initLockerItem(item.locker, item.category))
        this.closeLockerSelectModal()
        // console.log('onLockerSelected: ', item, this.gymRegisterMlState.itemList, this.itemList)
    }

    toggleMembershipListModal() {
        this.doShowMembershipListModal = !this.doShowMembershipListModal
    }
    closeMembershipListModal() {
        this.doShowMembershipListModal = false
    }
    onMembershipTicketSelected(item: MembershipItem) {
        this.gymRegisterMlState.create(this.gymRegisterMlState.initMembershipItem(item))
        this.closeMembershipListModal()
        // console.log('onMembershipTicketSelected: ', item, this.gymRegisterMlState.itemList, this.itemList)
    }
}
