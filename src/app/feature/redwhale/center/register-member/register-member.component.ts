import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core'

import { Router, ActivatedRoute } from '@angular/router'

import { StorageService } from '@services/storage.service'
import { CenterUsersService } from '@services/center-users.service'
import { DeeplinkService } from '@services/deeplink.service'
import { TimeService } from '@services/helper/time.service'

import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'

import QRCode from 'qrcode'

@Component({
    selector: 'app-register-member',
    templateUrl: './register-member.component.html',
    styleUrls: ['./register-member.component.scss'],
})
export class RegisterMemberComponent implements OnInit, AfterViewInit {
    @ViewChild('qrcode_canvas') qrcode_canvas: ElementRef
    @ViewChild('qrcode_canvas_download') qrcode_canvas_download: ElementRef

    public QRcode
    public center: Center = undefined

    public registeredUserList: CenterUser[] = []
    public registeredUserTimeList: { today: string; fullTime: string }[]

    public isMemberDetail: boolean
    public selectedMember: CenterUser
    public selectedMemberAge: string

    public loadingGetMembers = false

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private storageService: StorageService,
        private centerUsersService: CenterUsersService,
        private deeplinkService: DeeplinkService,
        private timeService: TimeService
    ) {
        this.isMemberDetail = false
        this.center = this.storageService.getCenter()
        console.log('gym data: ', this.center)
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.createGymQRcode()
        this.getMembershipList()
    }

    // qrcode method
    createGymQRcode() {
        const qrUri = this.deeplinkService.returnDeeplink(`gymId=${this.center.id}`)
        QRCode.toCanvas(this.qrcode_canvas.nativeElement, qrUri, { width: 160 }, (err) => {})
    }
    downloadGymQRcode(event) {
        const qrUri = this.deeplinkService.returnDeeplink(`gymId=${this.center.id}`)
        console.log('event: ', event)
        console.log('event.href: ', event)
        QRCode.toDataURL(this.qrcode_canvas_download.nativeElement, qrUri, { width: 400 }, (err, uri) => {
            if (err) throw err
            event.target.href = uri
            event.target.download = 'GYM_QRCODE.png'
        })
    }

    // get membership list
    getMembershipList(afterFn?: () => void) {
        this.loadingGetMembers = true
        this.centerUsersService.getUserList(this.center.id, '', 'member').subscribe((centerUsers) => {
            this.registeredUserList = centerUsers
                .reverse()
                .filter((v) => this.timeService.isRegisteredToday(v.created_at))
            this.registeredUserTimeList = Array.from({ length: this.registeredUserList.length }, () => {
                return { today: '', fullTime: '' }
            })
            this.registeredUserList.forEach((v, i) => {
                this.registeredUserTimeList[i].today = this.timeService.getTodayRegisteredTime(v.created_at)
                this.registeredUserTimeList[i].fullTime = v.created_at.slice(0, v.created_at.length - 3)
            })
            afterFn ? afterFn() : null

            this.loadingGetMembers = false
            console.log('registeredUserList ---- ', this.registeredUserList)
        })
    }

    // card method
    onCardClick(memberData: CenterUser, memberAge: string) {
        this.selectedMember = memberData
        this.selectedMemberAge = memberAge
        this.isMemberDetail = true
    }

    // --- member detail method
    // textarea method
    getUserAge(birth_date: string) {
        const birth = String(birth_date)
            .split('-')
            .reduce((pre, cur, idx) => {
                if (idx == 0) {
                    return pre + cur
                } else {
                    return pre + '.' + cur
                }
            }, '')
        return birth + ' (' + this.timeService.getKoreanMemberAge(birth_date) + '세)'
    }

    onTextAreaBlur(event) {
        this.centerUsersService
            .updateUser(this.center.id, this.selectedMember.id, {
                center_user_memo: event.target.value,
            })
            .subscribe((_) => {
                this.getMembershipList()
            })
    }

    onBack() {
        this.isMemberDetail = false
        this.selectedMember = null
    }
    allocateLockerAndMembership() {
        console.log('go to membership!')
    }

    //  member detail method ----//

    // router method
    goRouterLink(uri: string) {
        this.router.navigateByUrl(uri)
    }

    goDashboard() {
        // gym 화면 마지막 history 찾아서 가게끔 추가
        this.router.navigate(['../../member-management'], {
            relativeTo: this.activatedRoute,
        })
    }

    goDirectRegistration() {
        this.router.navigate(['../direct-registration'], {
            relativeTo: this.activatedRoute,
        })
    }
}
