import { Directive, ElementRef, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core'
import { fromEvent, Subscription } from 'rxjs'

@Directive({
    selector: '[rwClickOutside]',
})
export class ClickOutsideDirective implements AfterViewInit, OnDestroy {
    @Output('rwClickOutside') public clickOutside: EventEmitter<any> = new EventEmitter()

    private documentClick: Subscription

    constructor(private el: ElementRef) {}

    ngAfterViewInit() {
        this.documentClick = fromEvent(document, 'click').subscribe((event: MouseEvent) => {
            this.onDocumentClick(event)
        })
    }

    ngOnDestroy() {
        this.documentClick.unsubscribe()
    }

    onDocumentClick(event) {
        if (event instanceof MouseEvent && !this.el.nativeElement.contains(event.target)) {
            this.clickOutside.emit(event)
        }
    }
}
