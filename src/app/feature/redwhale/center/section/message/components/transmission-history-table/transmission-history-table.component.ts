import { Component, OnInit, Renderer2, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core'

@Component({
    selector: 'msg-transmission-history-table',
    templateUrl: './transmission-history-table.component.html',
    styleUrls: ['./transmission-history-table.component.scss'],
})
export class TransmissionHistoryTableComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('history_table') historyTableEl: ElementRef
    public resizeUnlistener: () => void
    public contentWidth = 0

    constructor(private renderer: Renderer2) {}

    ngOnInit(): void {}
    ngAfterViewInit() {
        this.initContentWidth()
        this.resizeUnlistener = this.renderer.listen('window', 'resize', (event) => {
            this.initContentWidth()
        })
    }
    ngOnDestroy() {
        this.resizeUnlistener()
    }

    initContentWidth() {
        if (window.innerWidth < 1440) {
            this.contentWidth = (370 / 1105) * (this.historyTableEl.nativeElement.offsetWidth - 45)
        } else if (window.innerWidth >= 1440) {
            this.contentWidth = (380 / 1265) * (this.historyTableEl.nativeElement.offsetWidth - 45)
        } else if (window.innerWidth >= 1920) {
            this.contentWidth = (410 / 1745) * (this.historyTableEl.nativeElement.offsetWidth - 45)
        }
    }

    public showHistoryDetailModal = false
    public openHistoryDetailModal(hd?: any) {
        this.showHistoryDetailModal = true
    }
    public closeHistoryDetailModal() {
        this.showHistoryDetailModal = false
    }
}
