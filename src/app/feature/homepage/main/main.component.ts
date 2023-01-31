import { Component, OnInit, Renderer2, OnDestroy, AfterViewInit } from '@angular/core'
import { Router } from '@angular/router'
import { DeviceDetectorService } from 'ngx-device-detector'
import _ from 'lodash'

import { HomepageComponent } from '../homepage.component'
@Component({
    selector: 'rw-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {
    constructor(private renderer: Renderer2, private deviceDetector: DeviceDetectorService, private router: Router) {}

    ngOnInit(): void {}
    ngOnDestroy(): void {}
    ngAfterViewInit(): void {
        this.onScroll()
        this.scrollListener = this.renderer.listen(document.getElementById('l-homepage'), 'scroll', () => {
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

    // ---------------------------------------------------------------------
    public nav_items: Array<{ value: string }> = [
        { value: '회원 관리' },
        { value: '스케줄 관리' },
        { value: '수업 예약' },
        { value: '매출 관리' },
        { value: '락커 관리' },
        { value: '채팅' },
        { value: '전자 계약' },
        { value: '문자' },
        { value: '출석 관리' },
    ]
}
