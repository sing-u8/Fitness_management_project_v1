import { Injectable } from '@angular/core'
import dayjs from 'dayjs'
// dayjs plugin
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
// dayjs/locale/...
import 'dayjs/locale/ko'
import 'dayjs/locale/en'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)

@Injectable({
    providedIn: 'root',
})
export class TimeService {
    constructor() {}

    getUtcTime() {
        return dayjs.utc().format()
    }
    getLocale() {
        const locale = navigator.language
        return locale
    }

    getLocalTimeObj(inputDate?: string) {
        const locale = this.getLocale()
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        const _dayjs = inputDate ? dayjs(inputDate) : dayjs()
        return _dayjs.tz(tz).locale(locale)
    }

    getLocalTime(inputDate: string, formatStr: string) {
        const format = formatStr ? formatStr : ''
        return this.getLocalTimeObj(inputDate).format(format)
    }

    getRelativeTime(inputDate: string, getLTFormat = 'LL') {
        const diffMinutes = dayjs.utc().diff(inputDate, 'minute')

        if (diffMinutes < 1) {
            return timeStr.KR.second
        } else if (parseInt(`${diffMinutes / timeScale.hour}`, 10) < 1) {
            return String(diffMinutes) + timeStr.KR.minute
        } else if (parseInt(`${diffMinutes / timeScale.day}`, 10) < 1) {
            return String(parseInt(`${diffMinutes / timeScale.hour}`, 10)) + timeStr.KR.hour
        } else if (parseInt(`${diffMinutes / timeScale.day}`, 10) < 7) {
            return String(parseInt(`${diffMinutes / timeScale.day}`, 10)) + timeStr.KR.day
        } else {
            return this.getLocalTime(inputDate, getLTFormat)
        }
    }

    // register new membership method
    getTodayRegisteredTime(inputDate: string) {
        const diffMinutes = dayjs.utc().diff(inputDate, 'minute')

        if (diffMinutes < 1) {
            return timeStr.KR.second
        } else if (parseInt(`${diffMinutes / timeScale.hour}`, 10) < 1) {
            return String(diffMinutes) + timeStr.KR.minute
        } else if (parseInt(`${diffMinutes / timeScale.day}`, 10) < 1) {
            return this.getLocalTime(inputDate, 'HH:mm')
        }
        return undefined
    }
    isRegisteredToday(inputDate: string) {
        return dayjs.utc().diff(inputDate, 'day') < 1 ? true : false
    }
    getMemberAge(inputDate: string) {
        return parseInt(`${dayjs.utc().diff(inputDate, 'year')}`)
    }
    getKoreanMemberAge(inputDate: string) {
        return dayjs(inputDate.slice(0, 4)).fromNow().slice(0, 2)
    }

    //

    getRestPeriod(startDate: string, endDate: string) {
        const date1 = dayjs(startDate).format('YYYY-MM-DD')
        const date2 = dayjs(endDate).format('YYYY-MM-DD')

        return dayjs(date2).diff(dayjs(date1), 'day') + 1
    }
}

const timeStr = {
    KR: {
        second: '방금 전',
        minute: '분 전',
        hour: '시간 전',
        day: '일 전',
    },
}
const timeScale = {
    // defalut scale = minute
    hour: 60,
    day: 60 * 24,
}
