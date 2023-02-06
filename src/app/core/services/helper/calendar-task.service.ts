import { Injectable } from '@angular/core'

import dayjs from 'dayjs'
import isSameOrBefor from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
dayjs.extend(isSameOrBefor)
dayjs.extend(isSameOrAfter)

import { CalendarTask } from '@schemas/calendar-task'
import { CalendarTaskOverview } from '@schemas/calendar-task-overview'

export type ClassCalendarTaskStatus = {
    status: 'bookable' | 'bookedFull' | 'taskEnd' | 'bookableDurationEnd'
    text: string
}

@Injectable({
    providedIn: 'root',
})
export class CalendarTaskService {
    constructor() {}

    isBookingEnd(ct: CalendarTaskOverview) {
        return dayjs(ct.end_booking).isBefore(dayjs(), 'm')
    }
    isCancelBookingEnd(ct: CalendarTaskOverview) {
        return dayjs(ct.cancel_booking).isBefore(dayjs(), 'm')
    }
    isBookedFull(ct: CalendarTaskOverview) {
        return ct.booked_count == ct.capacity
    }
    isTaskEnd(ct: CalendarTaskOverview) {
        return dayjs(ct.end).isBefore(dayjs(), 'm')
    }
    isBookable(ct: CalendarTaskOverview) {
        return dayjs(ct.start_booking).isSameOrBefore(dayjs(), 'm') && dayjs(ct.end_booking).isSameOrAfter(dayjs(), 'm')
    }
    isBookableDurationEnd(ct: CalendarTaskOverview) {
        return dayjs(ct.end_booking).isBefore(dayjs(), 'm')
    }

    getClassCalendarTaskStatus(ct: CalendarTaskOverview): ClassCalendarTaskStatus {
        if (this.isBookedFull(ct)) {
            return {
                status: 'bookedFull',
                text: '정원이 다 찼어요. 🎉',
            }
        } else if (this.isBookable(ct)) {
            return {
                status: 'bookable',
                text: '예약을 받고 있어요. 🤗',
            }
        } else if (this.isBookableDurationEnd(ct)) {
            return {
                status: 'bookableDurationEnd',
                text: '예약이 마감됐어요. 🚫',
            }
        } else if (this.isBookedFull(ct)) {
            return {
                status: 'taskEnd',
                text: '종료된 수업이에요. 🚫',
            }
        } else {
            return {
                status: undefined,
                text: undefined,
            }
        }
    }
}
