import { Pipe, PipeTransform } from '@angular/core'
import dayjs from 'dayjs'
import _ from 'lodash'

@Pipe({
    name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
    transform(date: string | number, format: string, markToday = false): unknown {
        if (markToday && dayjs().isSame(date, 'day')) {
            return '오늘'
        }
        if (_.isNumber(date)) {
            date = String(date)
        }
        return dayjs(date).format(format)
    }
}
