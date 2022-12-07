import { Component, OnInit, AfterViewInit, Input, OnChanges } from '@angular/core'

import { CalendarTask } from '@schemas/calendar-task'

@Component({
    selector: 'rw-drawer-modify-lesson-card',
    templateUrl: './drawer-modify-lesson-card.component.html',
    styleUrls: ['./drawer-modify-lesson-card.component.scss'],
})
export class DrawerModifyLessonCardComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() task: CalendarTask

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

    constructor() {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.initCardInfo()
    }
    ngOnChanges(): void {
        this.initCardInfo()
    }

    initCardInfo() {
        this.cardInfo.category_name = this.task.class.category_name
        this.cardInfo.color = this.task.color // !!  class color 필요
        this.cardInfo.name = this.task.class.name
        this.cardInfo.trainer_name = this.task.class.instructors[0].name
        this.cardInfo.type_name = this.task.class.type_code == 'class_item_type_group' ? '그룹 수업' : '1:1 수업'
        this.cardInfo.minutes = this.task.class.duration
    }
}
