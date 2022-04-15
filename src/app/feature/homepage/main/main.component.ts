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
        this.initScrollAniEls()
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
    scrollTop(height = 0) {
        window.scrollTo({
            top: height,
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

    initScrollAniEls() {
        const hpScrollAnis = document.querySelectorAll('.hp-scroll-ani')
        this.hpSAobjList = _.flatMapDeep(hpScrollAnis, (ani) => {
            let SAlist: Array<Element> = []
            _.forEach(ani.getElementsByClassName('hp-SA1'), (v) => SAlist.push(v))
            _.forEach(ani.getElementsByClassName('hp-SA2'), (v) => SAlist.push(v))
            _.forEach(ani.getElementsByClassName('hp-SA3'), (v) => SAlist.push(v))
            _.forEach(ani.getElementsByClassName('hp-SA4'), (v) => SAlist.push(v))
            _.forEach(ani.getElementsByClassName('hp-SA5'), (v) => SAlist.push(v))
            SAlist = _.flattenDeep(SAlist)
            return { parent: ani, children: SAlist }
        })
    }

    onScroll() {
        _.forEach(this.hpSAobjList, (obj) => {
            const windowHeight = window.innerHeight
            const elementTop = obj.parent.getBoundingClientRect().top
            if (elementTop < windowHeight - this.elementVisibleHeight) {
                _.forEach(obj.children, (child) => child.classList.add('active'))
            } else {
                _.forEach(obj.children, (child) => child.classList.remove('active'))
            }
        })
    }
}
