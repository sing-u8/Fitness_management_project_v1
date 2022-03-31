import { Component, OnInit, HostListener, ViewChild, ElementRef, Renderer2 } from '@angular/core'
import { state, style, trigger } from '@angular/animations'

import _ from 'lodash'

type NaviType = {
    [K in NaviTypeKeys]: boolean
}
type NaviTypeKeys = 'reentrance' | 'counselMember' | 'adjustSchedule' | 'manageWorkout'

@Component({
    selector: 'hp-main-carousel',
    templateUrl: './main-carousel.component.html',
    styleUrls: ['./main-carousel.component.scss'],
    animations: [
        trigger('imageIndicator', [
            state(
                'move',
                style({
                    transform: 'translate(calc({{imgIdx}} / {{imgListLen}} * -100%))',
                    transition: 'transform 0.3s ease-out',
                }),
                { params: { imgIdx: 0, imgListLen: 1 } }
            ),
        ]),
        trigger('onDrag', [
            state(
                'dragOn',
                style({
                    transform: 'translate(calc( {{i}} / {{n}} * -100% + {{tx}}px))',
                }),
                { params: { i: 1, n: 1, tx: 0 } }
            ),
        ]),
        trigger('autoScroll', [
            state(
                'scrolling',
                style({
                    transform: 'translate(calc({{imgIdx}} / {{imgListLen}} * -100%))',
                    transition: 'transform 0.3s ease-out',
                }),
                { params: { imgIdx: 0, imgListLen: 1 } }
            ),
            state('stop', style({})),
        ]),
    ],
})
export class MainCarouselComponent implements OnInit {
    public naviObj: NaviType = {
        reentrance: true,
        counselMember: false,
        adjustSchedule: false,
        manageWorkout: false,
    }

    @ViewChild('images') images_el: ElementRef

    constructor(private renderer: Renderer2) {}

    ngOnInit(): void {}

    public imageIdx = 0
    public imageLength = 4

    public isOnOtherWork = false
    public isTimerSet = false
    public autoScrollTimer

    isAutuScrollAvailable() {
        return !this.isOnOtherWork
    }
    startAutoScroll() {
        if (!this.isTimerSet) {
            this.autoScrollTimer = setInterval(() => {
                this.imageIdx = (this.imageIdx + 1) % this.imageLength
                const [curIndex, curNav] = this.checkNavImage()
                this.naviTo(curNav)
            }, 5000)
            this.isTimerSet = true
        }
    }
    stopAutoScroll() {
        clearInterval(this.autoScrollTimer)
        this.isTimerSet = false
    }
    setAutoScroll() {
        this.isAutuScrollAvailable() ? this.startAutoScroll() : this.stopAutoScroll()
    }

    @HostListener('mouseenter', ['$event'])
    onMouseEnter(e) {
        this.isOnOtherWork = true
        this.stopAutoScroll()
    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(e) {
        this.isOnOtherWork = false
        this.setAutoScroll()
    }

    // --------------------------

    naviTo(prop: NaviTypeKeys, auto = true) {
        _.forIn(this.naviObj, (_, key) => {
            if (prop == key) {
                this.naviObj[key] = true
            } else {
                this.naviObj[key] = false
            }
        })

        if (auto == false) {
            const navObjKeys = _.keys(this.naviObj)
            const curIndex = _.findIndex(navObjKeys, (v, i) => v == prop)
            this.imageIdx = curIndex
        }
    }

    // check nav image
    checkNavImage(): [number, NaviTypeKeys] {
        const navObjKeys = _.keys(this.naviObj)
        const curIndex = _.findIndex(navObjKeys, (v, i) => i == this.imageIdx)

        return [curIndex, navObjKeys[curIndex] as NaviTypeKeys]
    }
}
