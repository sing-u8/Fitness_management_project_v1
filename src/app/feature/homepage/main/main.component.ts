import {
    Component,
    OnInit,
    Renderer2,
    OnDestroy,
    AfterViewInit,
    ViewChild,
    ElementRef,
    ViewChildren,
    QueryList,
} from '@angular/core'
import { Router } from '@angular/router'
import { DeviceDetectorService } from 'ngx-device-detector'
import _ from 'lodash'

@Component({
    selector: 'rw-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {
    constructor(private renderer: Renderer2, private deviceDetector: DeviceDetectorService, private router: Router) {}

    ngOnInit(): void {}
    ngOnDestroy(): void {
        this.scrollListener()
        this.resizeListener()
    }
    ngAfterViewInit(): void {
        this.initNavItems()

        this.onScroll()
        this.setResizeVars()
        this.resizeListener = this.renderer.listen(window, 'resize', (e) => {
            this.setResizeVars()
            console.log('window resize listen : ', e, window.innerWidth, this.headerHeight)
        })
        this.scrollListener = this.renderer.listen(document.getElementById('l-homepage'), 'scroll', () => {
            const h = document.getElementById('l-homepage')
            console.log(
                'l-homepage scroll listen : ',
                this.headerHeight,
                this.l_title_el.nativeElement.clientHeight,
                h.scrollTop,
                h.scrollHeight,
                h.offsetHeight,
                this.member_management_el.nativeElement.getBoundingClientRect(),
                this.schedule_management_el.nativeElement.getBoundingClientRect(),
                this.lesson_reservation_el.nativeElement.getBoundingClientRect(),
                document.getElementById('l-homepage').getBoundingClientRect()
            )
            this.setNavOnScroll()
            this.onScroll()
        })

        const h = document.getElementById('l-homepage')
        h.scrollTo({ top: 0 })
        h.scrollTo({ top: 1 })
    }

    // ----------  free start modal ---------------//
    public isFreeStartModalVisible = false
    toggleFreeStartModalVisible() {
        if (this.deviceDetector.isDesktop()) {
            this.router.navigateByUrl('/auth/login')
        } else {
            this.isFreeStartModalVisible = !this.isFreeStartModalVisible
        }
    }
    onFreeStartCancel() {
        this.isFreeStartModalVisible = false
    }

    // ----------  scroll func ---------------//
    scrollTop() {
        const h = document.getElementById('l-homepage')
        h.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    // ----------  introduction modal funcs and vars ---------------//
    public receiveIntroVisible = false
    onReceiveIntroClose() {
        this.receiveIntroVisible = false
    }
    onReceiveIntroFinish() {
        this.receiveIntroVisible = false
    }
    onReceiveIntroOpen() {
        this.receiveIntroVisible = true
    }

    // -------------------- animation funcs and vals  ------------------//
    public scrollListener = undefined
    public elementVisibleHeight = 150
    public hpSAobjList: Array<{ parent: Element; children: Array<Element> }> = undefined

    onScroll() {
        _.forEach(this.hpSAobjList, (obj) => {
            const windowHeight = window.innerHeight
        })
    }

    public resizeListener = undefined
    public headerHeight = 50
    setResizeVars() {
        if (window.innerWidth >= 960) {
            this.headerHeight = 65
        } else {
            this.headerHeight = 50
        }
    }

    setNavOnScroll() {
        const title_rect = this.l_title_el.nativeElement.getBoundingClientRect()
        const main_rect = this.l_main_el.nativeElement.getBoundingClientRect()
        if (Math.abs(main_rect.y - this.headerHeight) >= title_rect.height) {
            this.renderer.addClass(this.l_main_nav_el.nativeElement, 'nav-fixed')
            this.renderer.setStyle(this.l_main_nav_el.nativeElement, 'top', `${this.headerHeight}px`)
            this.renderer.setStyle(this.l_main_nav_dummy_el.nativeElement, 'display', 'block')
        } else {
            this.renderer.removeClass(this.l_main_nav_el.nativeElement, 'nav-fixed')
            this.renderer.removeStyle(this.l_main_nav_el.nativeElement, 'top')
            this.renderer.removeStyle(this.l_main_nav_dummy_el.nativeElement, 'display')
        }

        this.setNavScrollActive()

        console.log(
            'set nav on scroll - ',
            this.l_title_el.nativeElement.className,
            this.l_title_el.nativeElement.classNames
        )
    }

    // ---------------------------------------------------------------------
    public nav_items: Array<{ value: string; el: ElementRef; onClick?: () => void }> = []
    initNavItems() {
        this.nav_items = [
            {
                value: '회원 관리',
                el: this.member_management_el,
                onClick: () => {
                    const h = document.getElementById('l-homepage')
                    h.scrollTo({
                        top: h.scrollTop - (150 - this.member_management_el.nativeElement.getBoundingClientRect().y),
                        behavior: 'smooth',
                    })
                },
            },
            {
                value: '스케줄 관리',
                el: this.schedule_management_el,
                onClick: () => {
                    const h = document.getElementById('l-homepage')
                    h.scrollTo({
                        top: h.scrollTop - (150 - this.schedule_management_el.nativeElement.getBoundingClientRect().y),
                        behavior: 'smooth',
                    })
                },
            },
            {
                value: '수업 예약',
                el: this.lesson_reservation_el,
                onClick: () => {
                    const h = document.getElementById('l-homepage')
                    h.scrollTo({
                        top: h.scrollTop - (150 - this.lesson_reservation_el.nativeElement.getBoundingClientRect().y),
                        behavior: 'smooth',
                    })
                },
            },
            {
                value: '매출 관리',
                el: this.sale_management_el,
                onClick: () => {
                    const h = document.getElementById('l-homepage')
                    h.scrollTo({
                        top: h.scrollTop - (150 - this.sale_management_el.nativeElement.getBoundingClientRect().y),
                        behavior: 'smooth',
                    })
                },
            },
            {
                value: '락커 관리',
                el: this.locker_management_el,
                onClick: () => {
                    const h = document.getElementById('l-homepage')
                    h.scrollTo({
                        top: h.scrollTop - (150 - this.locker_management_el.nativeElement.getBoundingClientRect().y),
                        behavior: 'smooth',
                    })
                },
            },
            {
                value: '채팅',
                el: this.chatting_el,
                onClick: () => {
                    const h = document.getElementById('l-homepage')
                    h.scrollTo({
                        top: h.scrollTop - (150 - this.chatting_el.nativeElement.getBoundingClientRect().y),
                        behavior: 'smooth',
                    })
                },
            },
            {
                value: '전자 계약',
                el: this.contract_el,
                onClick: () => {
                    const h = document.getElementById('l-homepage')
                    h.scrollTo({
                        top: h.scrollTop - (150 - this.contract_el.nativeElement.getBoundingClientRect().y),
                        behavior: 'smooth',
                    })
                },
            },
            {
                value: '문자',
                el: this.message_el,
                onClick: () => {
                    const h = document.getElementById('l-homepage')
                    h.scrollTo({
                        top: h.scrollTop - (150 - this.message_el.nativeElement.getBoundingClientRect().y),
                        behavior: 'smooth',
                    })
                },
            },
            {
                value: '출석 관리',
                el: this.attendance_el,
                onClick: () => {
                    const h = document.getElementById('l-homepage')
                    h.scrollTo({
                        top: h.scrollTop - (150 - this.attendance_el.nativeElement.getBoundingClientRect().y),
                        behavior: 'smooth',
                    })
                },
            },
        ]
    }

    // @ViewChildren('nav_item') navItems: QueryList<any>
    resetNavActive() {
        const navItems = this.l_main_nav_el.nativeElement.getElementsByClassName('nav-item')
        console.log('reset navv active : ', navItems)
        _.forEach(navItems, (v) => {
            this.renderer.removeClass(v, 'cur-item')
        })
    }
    setNavActive(eRef: ElementRef) {
        console.log('setNavActive - eRef : ', eRef)
        this.renderer.addClass(eRef, 'cur-item')
    }
    setNavScrollActive() {
        const mme = this.member_management_el.nativeElement.getBoundingClientRect()
        const sche = this.schedule_management_el.nativeElement.getBoundingClientRect()
        const lre = this.lesson_reservation_el.nativeElement.getBoundingClientRect()
        const sme = this.sale_management_el.nativeElement.getBoundingClientRect()
        const lme = this.locker_management_el.nativeElement.getBoundingClientRect()
        const che = this.chatting_el.nativeElement.getBoundingClientRect()
        const cne = this.contract_el.nativeElement.getBoundingClientRect()
        const msge = this.message_el.nativeElement.getBoundingClientRect()
        const atte = this.attendance_el.nativeElement.getBoundingClientRect()

        const navItems = this.l_main_nav_el.nativeElement.getElementsByClassName('nav-item')

        if (mme.height + mme.y > 40) {
            this.resetNavActive()
            this.setNavActive(navItems[0])
        } else if (sche.top <= 150 && sche.height + sche.y > 40) {
            this.resetNavActive()
            this.setNavActive(navItems[1])
        } else if (lre.top <= 150 && lre.height + lre.y > 40) {
            this.resetNavActive()
            this.setNavActive(navItems[2])
        } else if (sme.top <= 150 && sme.height + sme.y > 40) {
            this.resetNavActive()
            this.setNavActive(navItems[3])
        } else if (lme.top <= 150 && lme.height + lme.y > 40) {
            this.resetNavActive()
            this.setNavActive(navItems[4])
        } else if (che.top <= 150 && che.height + che.y > 40) {
            this.resetNavActive()
            this.setNavActive(navItems[5])
        } else if (cne.top <= 150 && cne.height + cne.y > 40) {
            this.resetNavActive()
            this.setNavActive(navItems[6])
        } else if (msge.top <= 150 && msge.height + msge.y > 40) {
            this.resetNavActive()
            this.setNavActive(navItems[7])
        } else if (atte.top <= 150) {
            this.resetNavActive()
            this.setNavActive(navItems[8])
        }
    }
    // ---------------------------------------------------------------------
    @ViewChild('l_main_el') l_main_el: ElementRef
    @ViewChild('l_title_el') l_title_el: ElementRef
    @ViewChild('l_main_nav_el') l_main_nav_el: ElementRef
    @ViewChild('l_main_nav_dummy_el') l_main_nav_dummy_el: ElementRef

    @ViewChild('member_management_el') member_management_el: ElementRef
    @ViewChild('schedule_management_el') schedule_management_el: ElementRef
    @ViewChild('lesson_reservation_el') lesson_reservation_el: ElementRef
    @ViewChild('sale_management_el') sale_management_el: ElementRef
    @ViewChild('locker_management_el') locker_management_el: ElementRef
    @ViewChild('chatting_el') chatting_el: ElementRef
    @ViewChild('contract_el') contract_el: ElementRef
    @ViewChild('message_el') message_el: ElementRef
    @ViewChild('attendance_el') attendance_el: ElementRef
}
