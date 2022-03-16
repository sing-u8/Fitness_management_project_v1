import { Component, OnInit, Renderer2, OnDestroy, AfterViewInit } from '@angular/core'

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
        const hpScrollTag = document.querySelectorAll('.hp-scroll-ani')
        console.log('hpScrooTags : ', hpScrollTag)
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
    public animationListener = undefined
}
