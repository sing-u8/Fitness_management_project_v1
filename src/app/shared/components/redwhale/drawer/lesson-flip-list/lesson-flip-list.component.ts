import { Component, OnInit, Input, AfterViewInit } from '@angular/core'

import { ClassCategory } from '@schemas/class-category'

@Component({
    selector: 'dw-lesson-flip-list',
    templateUrl: './lesson-flip-list.component.html',
    styleUrls: ['./lesson-flip-list.component.scss'],
})
export class LessonFlipListComponent implements OnInit, AfterViewInit {
    @Input() lessonCateg: ClassCategory

    public isOpen: boolean
    constructor() {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        if (this.lessonCateg.items.length > 0) {
            this.isOpen = true
        } else {
            this.isOpen = false
        }
    }

    toggleOpen() {
        this.isOpen = !this.isOpen
    }
}
