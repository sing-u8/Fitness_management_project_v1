import { Component, OnInit, Input, AfterViewInit, Renderer2, ViewChild, ElementRef, OnChanges } from '@angular/core'

@Component({
    selector: 'center-preview-item',
    templateUrl: './center-preview-item.component.html',
    styleUrls: ['./center-preview-item.component.scss'],
})
export class CenterPreviewItemComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() centerName = '센터 이름'
    @Input() centerAddress = ''
    @Input() centerAvatar: any = '센'
    @Input() centerBackgroundImage: string

    @ViewChild('list_header') list_header: ElementRef
    @ViewChild('list_avatar') list_avatar: ElementRef

    constructor(private renderer: Renderer2) {}

    ngOnInit(): void {}
    ngOnChanges(): void {
        // console.log('preview changes: ', this.centerName)
        this.resetCenterName()
        setTimeout(() => {
            this.initCenterAvatar()
            this.initCenterBackground()
        }, 5)
    }
    ngAfterViewInit(): void {
        this.initCenterAvatar()
        this.initCenterBackground()
    }
    initCenterAvatar() {
        if (this.centerAvatar.length < 2) {
            this.centerAvatar = this.centerName.slice(0, 1)
            this.renderer.setStyle(this.list_avatar.nativeElement, 'backgroundImage', `none`)
        } else {
            this.renderer.setStyle(this.list_avatar.nativeElement, 'backgroundImage', `url(${this.centerAvatar})`)
        }
    }
    initCenterBackground() {
        if (this.centerBackgroundImage) {
            this.renderer.setStyle(
                this.list_header.nativeElement,
                'backgroundImage',
                `url(${this.centerBackgroundImage})`
            )
        } else {
            this.renderer.setStyle(this.list_header.nativeElement, 'backgroundImage', `none`)
        }
    }

    resetCenterName() {
        if (!this.centerName) this.centerName = '센터 이름'
    }
}
