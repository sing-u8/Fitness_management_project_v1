import { Component, OnInit, Renderer2, OnDestroy, AfterViewInit } from '@angular/core'
import _ from 'lodash'
@Component({
    selector: 'rw-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {
    constructor(private renderer: Renderer2) {}

    ngOnInit(): void {}
    ngOnDestroy(): void {}
    ngAfterViewInit(): void {
        this.initScrollAniEls()
        this.onScroll()
        this.scrollListener = this.renderer.listen('window', 'scroll', () => {
            this.onScroll()
        })
    }

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

    // animation funcs and vals
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
        console.log('hpSAobj : ', this.hpSAobjList)
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
