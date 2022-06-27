import { Component, OnInit } from '@angular/core'

import dayjs from 'dayjs'
import _ from 'lodash'

import { StorageService } from '@services/storage.service'
import { GlobalService } from '@services/global.service'

import { UserLocker } from '@schemas/user-locker'
import { UserMembership } from '@schemas/user-membership'

import { Center } from '@schemas/center'

@Component({
    selector: 'touch-pad',
    templateUrl: './touch-pad.component.html',
    styleUrls: ['./touch-pad.component.scss'],
})
export class TouchPadComponent implements OnInit {
    public center: Center = undefined
    public touchPadInput: string

    public membershipList: Array<UserMembership> = []
    public lockerList: Array<UserLocker> = []
    public memberName = ''

    constructor(
        private storageService: StorageService,
        private globalService: GlobalService // private gymDashboardService: GymDashboardService, // private gymAttendanceService: GymAttendanceService, // private firestoreService: FirestoreService
    ) {
        this.center = this.storageService.getCenter()
        this.touchPadInput = ''
    }

    ngOnInit(): void {}

    // input functions
    formCheck() {
        this.touchPadInput = this.touchPadInput.replace(/[^0-9]/gi, '')
    }
    touch(number: string) {
        if (this.touchPadInput.length > 4) return
        this.touchPadInput += number
    }
    erase() {
        this.touchPadInput = this.touchPadInput.slice(0, this.touchPadInput.length - 1)
    }
    confirm() {
        if (this.touchPadInput.length == 0) return
        if (this.touchPadInput.length > 1 && this.touchPadInput.length < 4) {
            this.globalService.showToast('입력하신 회원 번호를 다시 확인해주세요.')
        }

        console.log('before api: ', this.touchPadInput)
        this.showAttendanceModal()
        // this.gymDashboardService.attendGym(this.center.id, { membership_number: this.touchPadInput }, 'touchpad').subscribe()
        // this.gymAttendanceService
        //     .createAttendance(this.center.id, { membership_number: this.touchPadInput }, 'touchpad')
        //     .subscribe(
        //         (res) => {
        //             this.firestoreService.setAttendance(this.center.id)

        //             this.gymAttendanceService
        //                 .getAttendanceList(this.center.id, '', dayjs().format('YYYY-MM-DD'))
        //                 .subscribe((attData) => {
        //                     const attendanceMember = _.find(attData, (att) => {
        //                         return res.attendance_id == Number(att.id)
        //                     })
        //                     console.log('attendanceMember: ', attendanceMember)

        //                     this.gymDashboardService
        //                         .getUserTicketList(this.center.id, attendanceMember.user.id)
        //                         .subscribe((tickets) => {
        //                             console.log('tickets: ', tickets)
        //                             this.lockerList = _.filter(
        //                                 tickets.locker,
        //                                 (locker) => locker.status == 'use' || locker.status == 'holding'
        //                             )
        //                             this.membershipList = _.filter(
        //                                 tickets.membership,
        //                                 (membership) => membership.status == 'use' || membership.status == 'holding'
        //                             )
        //                             this.memberName =
        //                                 attendanceMember.user.gym_user_name ?? attendanceMember.user.given_name

        //                             this.showAttendanceModal()
        //                         })
        //                 })
        //         },
        //         (err) => {
        //             this.globalService.showToast('입력하신 회원 번호를 다시 확인해주세요.')
        //         }
        //     )
    }

    public doShowAttendanceModal = false
    showAttendanceModal() {
        this.doShowAttendanceModal = true
    }
    closeAttendanceModal() {
        this.doShowAttendanceModal = false
        this.touchPadInput = ''
    }
}
