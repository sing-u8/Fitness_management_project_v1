import { Component, Input, OnInit, AfterViewInit } from '@angular/core'

import _ from 'lodash'

// ngrx
import { Store } from '@ngrx/store'
import * as FromSchedule from '@centerStore/reducers/sec.schedule.reducer'
import * as ScheduleActions from '@centerStore/actions/sec.schedule.actions'

@Component({
    selector: 'rw-sch-filter-dropdown',
    templateUrl: './sch-filter-dropdown.component.html',
    styleUrls: ['./sch-filter-dropdown.component.scss'],
})
export class SchFilterDropdownComponent implements OnInit, AfterViewInit {
    @Input() filter: FromSchedule.LectureFilter

    public isContentOpen = false
    constructor(private nxStore: Store) {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {}

    toggleContent() {
        this.isContentOpen = !this.isContentOpen
    }

    onCheckBoxSelect(key: string) {
        // key ==> FilterType
        this.filter[key].selected = !this.filter[key].selected
        this.nxStore.dispatch(ScheduleActions.setLectureFilter({ lectureFilter: this.filter }))
    }
}
