import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core'
import { Location } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import dayjs from 'dayjs'

// fullcalendar
import { FullCalendarComponent, CalendarOptions } from '@fullcalendar/angular'
import { EventClickArg, EventHoveringArg, EventDropArg } from '@fullcalendar/common'
import koLocale from '@fullcalendar/core/locales/ko'

@Component({
    selector: 'schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
