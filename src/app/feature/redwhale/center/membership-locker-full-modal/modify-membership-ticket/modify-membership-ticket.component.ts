import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import dayjs from 'dayjs'
import _ from 'lodash'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'
import { GymDashboardService } from '@services/gym-dashboard.service'
import { GymUserService } from '@services/gym-user.service'

import { GetUserReturn, MembershipTicket, ModifyMembershipTicketRequestBody } from '@schemas/gym-dashboard'
import { Center } from '@schemas/center'
import { MembershipItem } from '@schemas/membership-item'
import { ClassItem } from '@schemas/class-item'
import { CenterUser } from '@schemas/center-user'

type RouterState = { user: GetUserReturn; ticket: MembershipTicket }

@Component({
    selector: 'app-modify-membership-ticket',
    templateUrl: './modify-membership-ticket.component.html',
    styleUrls: ['./modify-membership-ticket.component.scss'],
})
export class ModifyMembershipTicketComponent implements OnInit, OnDestroy, AfterViewInit {
    public routerState: RouterState = { user: undefined, ticket: undefined }

    public datepickFlag: { start: boolean; end: boolean } = { start: false, end: false }
    public date = { startDate: '', endDate: '' }
    public dayDiff = ''

    public lessonItemList: Array<{ selected: boolean; item: ClassItem }>
    public selectedLessons: Array<ClassItem> = []
    public selectedLessonText = ''

    public doShowChargeModal = false
    public membershipItem: MembershipItem

    public price = ''
    public count: {
        count: string
        infinite: boolean
    } = { count: '0', infinite: false }
    public assignee: {
        name: string
        value: CenterUser
    } = { name: '', value: undefined }

    public center: Center

    public doShowCargeModal = false

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private gymDashboardService: GymDashboardService,
        private storageService: StorageService,
        private globalService: GlobalService
    ) {
        this.routerState = this.router.getCurrentNavigation().extras.state as RouterState
        this.center = this.storageService.getCenter()
    }
    ngOnInit(): void {
        if (!this.routerState) {
            this.backToDashboard()
        } else {
            this.date = { startDate: this.routerState.ticket.start_date, endDate: this.routerState.ticket.end_date }
            this.dayDiff = String(this.getDayDiff(this.date))

            this.count = {
                count: String(this.routerState.ticket.count),
                infinite: this.routerState.ticket.infinity_yn ? true : false,
            }
            this.price = String(this.routerState.ticket.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

            this.selectedLessons = this.routerState.ticket.lesson_item_list
            this.getSelectedLessonText()
        }
    }
    ngOnDestroy(): void {}
    ngAfterViewInit(): void {
        this.setLessonItemList()
        this.getSelectedLessonList()
    }

    getSelectedLessonText() {
        this.selectedLessonText =
            this.selectedLessons.length == 1
                ? `${this.selectedLessons[0].name}`
                : `${this.selectedLessons[0].name} 외 ${this.selectedLessons.length - 1}건`
    }
    setLessonItemList() {
        this.lessonItemList = _.map(this.routerState.ticket.lesson_item_list, (item) => {
            return { selected: true, item: item }
        })
    }
    getSelectedLessonList() {
        this.selectedLessons = _.map(_.filter(this.lessonItemList, ['selected', true]), (lessonObj) => lessonObj.item)
        if (this.selectedLessons.length == 0) return
        this.getSelectedLessonText()
    }
    isLessonSelected() {
        return _.some(this.lessonItemList, ['selected', true])
    }
    checkCount() {
        if ((this.count.count == '0' || !this.count.count) && !this.count.infinite) return false
        return true
    }
    saveMembershipTicket() {
        this.doShowCargeModal = true
    }

    // input medthod
    onPriceKeyup(event) {
        if (event.code == 'Enter') return
        this.price = this.price.replace(/[^0-9]/gi, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    onCountKeyup(event) {
        if (event.code == 'Enter') return
        this.count.count = this.count.count.replace(/[^0-9]/gi, '')
    }
    // datepicker method
    public isStartDateClicked = false
    onDatePickRangeChange(event: { startDate: string; endDate: string }, type: 'start' | 'end') {
        console.log('onDateChange: ', event)
        this.date = event
        this.dayDiff = String(this.getDayDiff(this.date))
        if (type == 'start') {
            this.isStartDateClicked = true
            this.datepickFlag.start = false
            this.datepickFlag.end = true
        } else {
            this.isStartDateClicked = false
        }
    }

    getDayDiff(date: { startDate: string; endDate: string }) {
        const date1 = dayjs(date.startDate)
        const date2 = dayjs(date.endDate)

        return date2.diff(date1, 'day') + 1
    }

    // routing function
    backToDashboard() {
        this.router.navigate(['../../'], { relativeTo: this.activatedRoute })
    }

    // modify membership data
    modifyMembershipTicketData(chargeData: {
        pay_card: number
        pay_cash: number
        pay_trans: number
        unpaid: number
        pay_date: string
        assignee_id: string
    }) {
        const reqBody: ModifyMembershipTicketRequestBody = {
            lesson_item_ids: _.map(
                _.filter(this.lessonItemList, (lesson) => lesson.selected),
                (lesson) => Number(lesson.item.id)
            ),
            start_date: this.date.startDate,
            end_date: this.date.endDate,
            count: Number(this.count.count),
            infinity_yn: this.count.infinite ? 1 : 0,
            assignee_id: chargeData.assignee_id,
            pay_card: chargeData.pay_card,
            pay_cash: chargeData.pay_cash,
            pay_trans: chargeData.pay_trans,
            unpaid: chargeData.unpaid,
            paid_date: chargeData.pay_date,
        }

        this.doShowCargeModal = false
        this.gymDashboardService
            .modifyMembershipTicket(
                this.routerState.ticket.gym_id,
                this.routerState.user.id,
                this.routerState.ticket.id,
                reqBody
            )
            .subscribe((__) => {
                const ticketName =
                    this.routerState.ticket.name.length > 16
                        ? this.routerState.ticket.name.slice(0, 15)
                        : this.routerState.ticket.name
                this.router.navigate(['../../'], { relativeTo: this.activatedRoute, state: { modifyTicket: true } })
                this.globalService.showToast(`'${ticketName}' 회원권 정보가 수정되었습니다.`)
            })
    }
}
