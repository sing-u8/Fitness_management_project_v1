import { Component, OnInit, Input } from '@angular/core'

@Component({
    selector: 'rw-drag-guide',
    templateUrl: './drag-guide.component.html',
    styleUrls: ['./drag-guide.component.scss'],
})
export class DragGuideComponent implements OnInit {
    @Input() showGuide: boolean
    @Input() isSideBar: boolean
    constructor() {}

    ngOnInit(): void {}
}
