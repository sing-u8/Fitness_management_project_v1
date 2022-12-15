import { Component, OnInit, AfterViewInit, Input, OnChanges } from '@angular/core'

import { WordService } from '@services/helper/word.service'

import { ClassItem } from '@schemas/class-item'
import _ from 'lodash'

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
        const insts = _.orderBy(this.lesson.instructors, 'name')
        this.cardInfo.category_name = this.lesson.category_name
        this.cardInfo.color = this.lesson.color
        this.cardInfo.name = this.lesson.name
        this.cardInfo.trainer_name =
            this.lesson.instructors.length > 1
                ? this.wordService.ellipsis(this.lesson.instructors[0].name, 6) +
                  ` 외 ${insts.length - 1}명`
                : this.wordService.ellipsis(this.lesson.instructors[0].name, 6)
        this.cardInfo.type_name = this.lesson.type_code_name
        this.cardInfo.minutes = this.lesson.duration
    }
}
