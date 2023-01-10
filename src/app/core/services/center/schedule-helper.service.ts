import { Injectable } from '@angular/core'
import _ from 'lodash'

import { Store } from '@ngrx/store'
import * as ScheduleActions from '@centerStore/actions/sec.schedule.actions'
import { CenterUser } from '@schemas/center-user'

@Injectable({
    providedIn: 'root',
})
export class ScheduleHelperService {
    constructor(private nxStore: Store) {}

    getLessonEndTime(startTime: string, minutes: number) {
        // startTime = xx:xx:xx
        const startTimeList = _.split(startTime, ':', 2)
        const minute = Number(startTimeList[1]) + minutes
        const quotient = parseInt(`${minute / 60}`, 10)
        const remainder = Number(minute) % 60

        const hour =
            String(Number(startTimeList[0]) + quotient).length == 1
                ? `0${Number(startTimeList[0]) + quotient}`
                : Number(startTimeList[0]) + quotient
        return `${hour}:${remainder == 0 ? '00' : remainder}` // xx:xx
    }

    // synchronize
    startSynchronizeInstructorList(centerId: string, centerUser: CenterUser) {
        // this.nxStore.dispatch(ScheduleActions.setCurCenterId({ centerId }))
        // this.nxStore.dispatch(ScheduleActions.startLoadScheduleState())
        this.nxStore.dispatch(ScheduleActions.startSynchronizeInstructorList({ centerId, centerUser }))
    }
}
