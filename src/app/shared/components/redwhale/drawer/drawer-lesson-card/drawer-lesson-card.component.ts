import { Component, OnInit, AfterViewInit, Input, OnChanges } from '@angular/core'

import { WordService } from '@services/helper/word.service'

import { ClassItem } from '@schemas/class-item'

@Component({
    selector: 'rw-drawer-lesson-card',
    templateUrl: './drawer-lesson-card.component.html',
    styleUrls: ['./drawer-lesson-card.component.scss'],
})
export class DrawerLessonCardComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() lesson: ClassItem
    @Input() categId: string
    @Input() mode: 'select' | 'view'

    public cardInfo: {
        color: string
        category_name: string
        name: string
        type_name: string
        trainer_name: string
        minutes: number
    } = {
        color: '',
        category_name: '',
        name: '',
        type_name: '',
        trainer_name: '',
        minutes: undefined,
    }

    constructor(private wordService: WordService) {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.mode = this.mode ?? 'select'
        this.initCardInfo()
    }
    ngOnChanges(): void {
        this.initCardInfo()
        // console.log('onChange in drawer-lesson card: ', this.lesson)
    }

    initCardInfo() {
        this.cardInfo.category_name = this.lesson.category_name
        this.cardInfo.color = this.lesson.color
        this.cardInfo.name = this.lesson.name
        this.cardInfo.trainer_name = this.wordService.ellipsis(this.lesson.instructors[0].center_user_name, 15)
        this.cardInfo.type_name = this.lesson.type_code_name
        this.cardInfo.minutes = this.lesson.duration
    }
}
