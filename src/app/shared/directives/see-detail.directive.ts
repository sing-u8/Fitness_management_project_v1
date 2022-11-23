import { Directive, ElementRef, Input, Output, EventEmitter, AfterViewInit, OnDestroy, Renderer2 } from '@angular/core'

import _ from 'lodash'

@Directive({
    selector: '[rwSeeDetail]',
})
export class SeeDetailDirective implements AfterViewInit, OnDestroy {
    @Input() seeMoreCount = 3
    public _seeMoreCount = 0
    @Input() text: string
    public textList: string[] = []
    
    @Output() onSeeMoreClick = new EventEmitter<any>()
    
    public unitHeight = 0

    public resizeUnListener: () => void

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.renderer.addClass(this.el.nativeElement, 'd-flex')
        this.renderer.addClass(this.el.nativeElement, 'flex-column')
    }

    ngAfterViewInit() {
        this.textList = _.split(this.text, `\n`)

        this.textList.forEach((v, idx) => {
            const divEl = document.createElement('div')
            divEl.innerHTML = v
            divEl.style.width = 'fit-content'
            this.renderer.appendChild(this.el.nativeElement, divEl)
        })
        this.setSeeMoreClickButton()

        this.resizeUnListener = this.renderer.listen(window, 'resize', (e) => {
            this.setSeeMoreClickButton()
        })
    }
    ngOnDestroy() {
        this.resizeUnListener()
    }

    setSeeMoreClickButton() {
        this.setUnitHeight()
        this._seeMoreCount = 0
        const idx =
            _.findIndex(this.el.nativeElement.children, (v: any) => {
                console.log('set see more click button findIndex -- ', v.offsetHeight > this.unitHeight, v.offsetHeight ,' - ', this.unitHeight)
                this._seeMoreCount += v.offsetHeight > this.unitHeight ? 2 : 1
                return this._seeMoreCount >= this.seeMoreCount
            })
        console.log('setSeeMoreClickButton -- idx : ', idx)
        if (idx != -1) {
            this.el.nativeElement.children[idx].innerHTML =
                this.el.nativeElement.children[idx].innerHTML.length < 15
                    ? this.el.nativeElement.children[idx].innerHTML + '...'
                    : _.truncate(this.el.nativeElement.children[idx].innerHTML, {
                          length: 15,
                          omission: '...',
                      })
            
            const bt = document.createElement('span')
            bt.innerHTML='더보기'
            bt.style.fontWeight = '700'
            bt.style.textUnderlineOffset = '6px'
            bt.style.textDecoration = 'underline'
            bt.style.textDecorationThickness = '3px'
            bt.style.marginLeft = '5px'
            bt.style.cursor='pointer'
            
            bt.addEventListener('click', (e) => {
                this.onSeeMoreClick.emit()
            })
            this.el.nativeElement.children[idx].appendChild(bt)
        }
    }
    setUnitHeight() {
        _.forEach(this.el.nativeElement.children, (v, idx) => {
            this.el.nativeElement.children[idx].innerHTML = this.textList[idx]
            if (
                (this.unitHeight >= this.el.nativeElement.children[idx].offsetHeight || this.unitHeight == 0) &&
                this.el.nativeElement.children[idx].offsetHeight != 0
            ) {
                this.unitHeight = this.el.nativeElement.children[idx].offsetHeight
            }
        })
    }
}
