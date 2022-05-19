import { AfterViewInit, Directive, ElementRef, Input, Output, Renderer2, OnDestroy } from '@angular/core'

@Directive({
    selector: '[rwEllipsisDropdown]',
})
export class EllipsisDropdownDirective implements AfterViewInit, OnDestroy {
    @Input() lineClamp = 1
    @Input() deviation = 0

    public dropDownMouseOverUnlistener: () => void = () => {}
    public dropDownMouseLeaveUnlistener: () => void = () => {}

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

    ngAfterViewInit(): void {
        const element = this.elementRef.nativeElement
        this.renderer.setStyle(element, 'position', 'relative')
        const innerText = element.innerText

        const span = this.renderer.createElement('span')
        element.innerText = ''
        span.innerText = innerText
        this.renderer.appendChild(element, span)

        const dropDown = this.renderer.createElement('div')
        dropDown.innerText = innerText
        this.renderer.appendChild(element, dropDown)
        this.renderer.addClass(dropDown, 'ellipsis-dropdown')
        this.renderer.setStyle(dropDown, 'bottom', `-${dropDown.offsetHeight + 5}px`)
        this.renderer.setStyle(dropDown, 'z-index', `5`)
        this.renderer.setStyle(dropDown, 'display', 'none')

        this.renderer.setStyle(element, 'position', 'relative')
        this.renderer.addClass(span, 'line-ellipsis')

        setTimeout(() => {
            if (this.checkIsOverFlow(span, this.lineClamp, this.deviation)) {
                this.dropDownMouseOverUnlistener = this.renderer.listen(element, 'mouseover', (e) => {
                    this.renderer.setStyle(dropDown, 'display', 'flex')
                })
                this.dropDownMouseLeaveUnlistener = this.renderer.listen(element, 'mouseleave', (e) => {
                    this.renderer.setStyle(dropDown, 'display', 'none')
                })
            }
        }, 10)
    }
    ngOnDestroy(): void {
        this.dropDownMouseOverUnlistener()
        this.dropDownMouseLeaveUnlistener()
    }

    getContentWidth(element) {
        const styles = getComputedStyle(element)
        return element.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight)
    }
    checkIsOverFlow(element, line: number, deviation: number) {
        const elementStyles = getComputedStyle(element)
        return Number(elementStyles.lineHeight.replace(/[^0-9]/gi, '')) * line <= element.offsetHeight - deviation
    }
}

// console.log(
//     'checkIsOverFlow - ',
//     element.innerText,
//     Number(elementStyles.lineHeight.replace(/[^0-9]/gi, '')) * line,
//     element.offsetHeight - deviation,
//     Number(elementStyles.lineHeight.replace(/[^0-9]/gi, '')) * line <= element.offsetHeight - deviation,
//     element.clientHeight
// )
