import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core'

import { ClassCategory } from '@schemas/class-category'
import { Loading } from '@schemas/store/loading'
import { ClassItem } from '@schemas/class-item'

import { CenterLessonService } from '@services/center-lesson.service'

@Component({
    selector: 'dw-lesson-flip-list',
    templateUrl: './lesson-flip-list.component.html',
    styleUrls: ['./lesson-flip-list.component.scss'],
})
export class LessonFlipListComponent implements OnInit, AfterViewInit {
    @Input() lessonCateg: ClassCategory
    @Input() centerId: string

    @Output() onLessonClick = new EventEmitter<{ lesson: ClassItem; lessonCateg: ClassCategory }>()

    public isOpen = false

    public loading: Loading = 'idle'
    public lessonItems: Array<ClassItem> = []
    constructor(private centerLessonApi: CenterLessonService) {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        // if (this.lessonCateg.items.length > 0) {
        //     this.isOpen = true
        // } else {
        //     this.isOpen = false
        // }
    }

    toggleOpen() {
        this.isOpen = !this.isOpen
        if (this.loading == 'idle' && this.isOpen == true) {
            this.loading = 'pending'
            this.centerLessonApi.getItems(this.centerId, this.lessonCateg.id).subscribe((lessonItems) => {
                this.loading = 'done'
                this.lessonItems = lessonItems
            })
        }
    }

    _onLessonClick(classItem: ClassItem) {
        this.onLessonClick.emit({
            lesson: classItem,
            lessonCateg: this.lessonCateg,
        })
    }
}
