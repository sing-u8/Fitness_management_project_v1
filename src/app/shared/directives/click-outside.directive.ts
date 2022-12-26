import { Directive, ElementRef, Output, EventEmitter, AfterViewInit, OnDestroy, HostListener } from '@angular/core'
import { fromEvent, Subscription } from 'rxjs'

@Directive({
    selector: '[rwClickOutside]',
})
export class ClickOutsideDirective implements AfterViewInit, OnDestroy {
    @Output('rwClickOutside') public clickOutside: EventEmitter<any> = new EventEmitter()

    private documentClick: Subscription
    constructor(private elementRef: ElementRef) {}

    ngAfterViewInit() {
        this.documentClick = fromEvent(document, 'click').subscribe((event: MouseEvent) => {
            this.onDocumentClick(event)
        })
    }

    ngOnDestroy() {
        this.documentClick.unsubscribe()
    }

    onDocumentClick(event) {
        if (event instanceof MouseEvent && !this.elementRef.nativeElement.contains(event.target)) {
            this.clickOutside.emit(event)
        }
    }

    // constructor(private el: ElementRef) {}

    // @Output() rwClickOutside = new EventEmitter<MouseEvent>()
    //
    // @HostListener('document:click', ['$event', '$event.target'])
    // public onClick(event: MouseEvent, targetElement: HTMLElement): void {
    //     if (!targetElement) {
    //         return
    //     }
    //     const clickedInside = this.elementRef.nativeElement.contains(targetElement)
    //     if (!clickedInside) {
    //         this.rwClickOutside.emit(event)
    //     }
    // }
}
