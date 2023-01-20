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

    public seeMoreLimitNumber = 20

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
        const idx = _.findIndex(this.el.nativeElement.children, (v: any, i) => {
            this._seeMoreCount += _.round(v.offsetHeight / this.unitHeight)
            console.log('this._seeMoreCount -- ', this._seeMoreCount)
            return this._seeMoreCount >= this.seeMoreCount
        })
        let h = 0
        let heightIdx = _.findIndex(this.el.nativeElement.children, (v: any, i) => {
            h += v.offsetHeight
            return h >= this.el.nativeElement.offsetHeight
        })

        let _idx
        if (idx != -1) {
            heightIdx = heightIdx == -1 ? 0 : heightIdx
            _idx = idx > heightIdx ? heightIdx : idx
        } else {
            _idx = heightIdx
        }
        if (_idx != -1) {
            this.el.nativeElement.children[_idx].innerHTML =
                this.el.nativeElement.children[_idx].innerHTML.length < this.seeMoreLimitNumber
                    ? this.el.nativeElement.children[_idx].innerHTML + '...'
                    : _.truncate(this.el.nativeElement.children[_idx].innerHTML, {
                          length: this.seeMoreLimitNumber,
                          omission: '...',
                      })

            this.renderer.setStyle(
                this.el.nativeElement,
                'height',
                `${(this._seeMoreCount >= 3 && _idx > 0 ? 3 : _idx + 1) * 32 + (_idx != 0 ? 6 : 0)}px`
            )

            const bt = document.createElement('span')
            bt.innerHTML = '더보기'
            bt.style.fontWeight = '700'
            bt.style.textUnderlineOffset = '6px'
            bt.style.textDecoration = 'underline'
            bt.style.textDecorationThickness = '3px'
            bt.style.marginLeft = '10px'
            bt.style.cursor = 'pointer'

            bt.addEventListener('click', (e) => {
                this.onSeeMoreClick.emit()
            })
            this.el.nativeElement.children[_idx].appendChild(bt)
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
