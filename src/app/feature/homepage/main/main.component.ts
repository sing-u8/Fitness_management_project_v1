import { Component, OnInit, Renderer2, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
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
        this.setResizeVars()
        this.initNavItems()
        this.resizeListener = this.renderer.listen(window, 'resize', (e) => {
            this.setResizeVars()
            this.setNavOnScroll()
        })
        this.scrollListener = this.renderer.listen(document.getElementById('l-homepage'), 'scroll', () => {
            this.setNavOnScroll()
        })
        this.navScrollListener = this.renderer.listen(this.l_main_nav_el.nativeElement, 'scroll', () => {
            const navItems = this.l_main_nav_el.nativeElement.getElementsByClassName('nav-item')
            console.log(
                'set nav on scroll - ',
                this.l_main_nav_el.nativeElement.scrollLeft,
                this.l_main_nav_el.nativeElement.scrollWidth,
                this.l_main_nav_el.nativeElement.getBoundingClientRect(),
                'set nav scroll 0 -- ',
                navItems[0].getBoundingClientRect(),
                'set nav scroll 1 -- ',
                navItems[1].getBoundingClientRect(),
                'set nav scroll 2 -- ',
                navItems[2].getBoundingClientRect(),
                'set nav scroll 3 -- ',
                navItems[3].getBoundingClientRect(),
                'set nav scroll 4 -- ',
                navItems[4].getBoundingClientRect(),
                'set nav scroll 5 -- ',
                navItems[5].getBoundingClientRect(),
                'set nav scroll 6 -- ',
                navItems[6].getBoundingClientRect(),
                'set nav scroll 7 -- ',
                navItems[7].getBoundingClientRect(),
                'set nav scroll 8 -- ',
                navItems[8].getBoundingClientRect()
            )
        })

        const h = document.getElementById('l-homepage')
        setTimeout(() => {
            h.scrollTo({ top: 0 })
            h.scrollTo({ top: 1 })
            h.scrollTo({ top: 0 })
        }, 100)
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
    public resizeListener = undefined
    public navScrollListener = undefined

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
    }

    // ---------------------------------------------------------------------
    public nav_items: Array<{ value: string; el: ElementRef; onClick?: () => void }> = []
    initNavItems() {
        const navItems = this.l_main_nav_el.nativeElement.getElementsByClassName('nav-item')

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
                    this.l_main_nav_el.nativeElement.scrollTo({
                        left:
                            this.l_main_nav_el.nativeElement.scrollLeft - (10 - navItems[0].getBoundingClientRect().x),
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
                    this.l_main_nav_el.nativeElement.scrollTo({
                        left:
                            this.l_main_nav_el.nativeElement.scrollLeft - (10 - navItems[1].getBoundingClientRect().x),
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
                    this.l_main_nav_el.nativeElement.scrollTo({
                        left:
                            this.l_main_nav_el.nativeElement.scrollLeft - (10 - navItems[2].getBoundingClientRect().x),
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
                    this.l_main_nav_el.nativeElement.scrollTo({
                        left:
                            this.l_main_nav_el.nativeElement.scrollLeft - (10 - navItems[3].getBoundingClientRect().x),
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
                    this.l_main_nav_el.nativeElement.scrollTo({
                        left:
                            this.l_main_nav_el.nativeElement.scrollLeft - (10 - navItems[4].getBoundingClientRect().x),
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
                    this.l_main_nav_el.nativeElement.scrollTo({
                        left:
                            this.l_main_nav_el.nativeElement.scrollLeft - (10 - navItems[5].getBoundingClientRect().x),
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
                    this.l_main_nav_el.nativeElement.scrollTo({
                        left:
                            this.l_main_nav_el.nativeElement.scrollLeft - (10 - navItems[6].getBoundingClientRect().x),
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
                    this.l_main_nav_el.nativeElement.scrollTo({
                        left:
                            this.l_main_nav_el.nativeElement.scrollLeft - (10 - navItems[7].getBoundingClientRect().x),
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
                    this.l_main_nav_el.nativeElement.scrollTo({
                        left:
                            this.l_main_nav_el.nativeElement.scrollLeft - (10 - navItems[8].getBoundingClientRect().x),
                        behavior: 'smooth',
                    })
                },
            },
        ]
    }

    // @ViewChildren('nav_item') navItems: QueryList<any>
    resetNavActive() {
        const navItems = this.l_main_nav_el.nativeElement.getElementsByClassName('nav-item')
        _.forEach(navItems, (v) => {
            this.renderer.removeClass(v, 'cur-item')
        })
    }
    setNavActive(eRef: ElementRef) {
        if (!_.isEmpty(eRef)) this.renderer.addClass(eRef, 'cur-item')
    }
    setNavScrollActive() {
        const h = document.getElementById('l-homepage')

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
            this.l_main_nav_el.nativeElement.scrollTo({
                left: this.l_main_nav_el.nativeElement.scrollLeft - (10 - navItems[0].getBoundingClientRect().x),
                behavior: 'smooth',
            })
        } else if (sche.top <= 150 && sche.height + sche.y > 40) {
            this.resetNavActive()
            this.setNavActive(navItems[1])
            this.l_main_nav_el.nativeElement.scrollTo({
                left: this.l_main_nav_el.nativeElement.scrollLeft - (10 - navItems[1].getBoundingClientRect().x),
                behavior: 'smooth',
            })
        } else if (lre.top <= 150 && lre.height + lre.y > 40) {
            this.resetNavActive()
            this.setNavActive(navItems[2])
            this.l_main_nav_el.nativeElement.scrollTo({
                left: this.l_main_nav_el.nativeElement.scrollLeft - (10 - navItems[2].getBoundingClientRect().x),
                behavior: 'smooth',
            })
        } else if (sme.top <= 150 && sme.height + sme.y > 40) {
            this.resetNavActive()
            this.setNavActive(navItems[3])
            this.l_main_nav_el.nativeElement.scrollTo({
                left: this.l_main_nav_el.nativeElement.scrollLeft - (10 - navItems[3].getBoundingClientRect().x),
                behavior: 'smooth',
            })
        } else if (lme.top <= 150 && lme.height + lme.y > 40) {
            this.resetNavActive()
            this.setNavActive(navItems[4])
            this.l_main_nav_el.nativeElement.scrollTo({
                left: this.l_main_nav_el.nativeElement.scrollLeft - (10 - navItems[4].getBoundingClientRect().x),
                behavior: 'smooth',
            })
        } else if (che.top <= 150 && che.height + che.y > 40) {
            this.resetNavActive()
            this.setNavActive(navItems[5])
            this.l_main_nav_el.nativeElement.scrollTo({
                left: this.l_main_nav_el.nativeElement.scrollLeft - (10 - navItems[5].getBoundingClientRect().x),
                behavior: 'smooth',
            })
        } else if (cne.top <= 150 && cne.height + cne.y > 40) {
            this.resetNavActive()
            this.setNavActive(navItems[6])
            this.l_main_nav_el.nativeElement.scrollTo({
                left: this.l_main_nav_el.nativeElement.scrollLeft - (10 - navItems[6].getBoundingClientRect().x),
                behavior: 'smooth',
            })
        } else if (msge.top <= 150 && msge.height + msge.y > 40 && h.scrollTop + h.offsetHeight != h.scrollHeight) {
            this.resetNavActive()
            this.setNavActive(navItems[7])
            this.l_main_nav_el.nativeElement.scrollTo({
                left: this.l_main_nav_el.nativeElement.scrollLeft - (10 - navItems[7].getBoundingClientRect().x),
                behavior: 'smooth',
            })
        } else if (atte.top <= 150 || h.scrollTop + h.offsetHeight == h.scrollHeight) {
            this.resetNavActive()
            this.setNavActive(navItems[8])
            this.l_main_nav_el.nativeElement.scrollTo({
                left: this.l_main_nav_el.nativeElement.scrollLeft - (10 - navItems[8].getBoundingClientRect().x),
                behavior: 'smooth',
            })
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
