import { SimpleChanges, Renderer2, ElementRef } from '@angular/core'

/**
 * visible var's name must be 'visible'
 * @param changes : SimpleChanges
 * @param renderer : Renderer2
 * @param bgElRef : ElementRef - background element Ref
 * @param wrapperElRef : ElementRef - Wrapper element Ref
 */
export function setVisibleOnChange(
    changes: SimpleChanges,
    renderer: Renderer2,
    bgElRef: ElementRef,
    wrapperElRef: ElementRef
) {
    if (!bgElRef || !wrapperElRef) return
    if (!changes['visible'].firstChange) {
        if (
            changes['visible'].previousValue != changes['visible'].currentValue &&
            changes['visible'].currentValue == true
        ) {
            renderer.addClass(bgElRef.nativeElement, 'display-block')
            renderer.addClass(wrapperElRef.nativeElement, 'display-flex')
            setTimeout(() => {
                renderer.addClass(bgElRef.nativeElement, 'rw-modal-background-show')
                renderer.addClass(wrapperElRef.nativeElement, 'rw-modal-wrapper-show')
            }, 0)
        } else if (
            changes['visible'].previousValue != changes['visible'].currentValue &&
            changes['visible'].currentValue == false
        ) {
            renderer.removeClass(bgElRef.nativeElement, 'rw-modal-background-show')
            renderer.removeClass(wrapperElRef.nativeElement, 'rw-modal-wrapper-show')
            setTimeout(() => {
                renderer.removeClass(bgElRef.nativeElement, 'display-block')
                renderer.removeClass(wrapperElRef.nativeElement, 'display-flex')
            }, 200)
        }
    }
}
