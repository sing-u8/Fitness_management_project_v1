import { Injectable } from '@angular/core'
import _ from 'lodash'

import { ClassCategory } from '@schemas/class-category'
import { ClassItem } from '@schemas/class-item'

@Injectable({
    providedIn: 'root',
})
export class ScheduleHelperService {
    constructor() {}

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
        const endTime = `${hour}:${remainder}`
        return endTime // xx:xx
    }
}
