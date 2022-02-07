import { Pipe, PipeTransform } from '@angular/core'
import dayjs from 'dayjs'
@Pipe({
    name: 'dayDiff',
})
export class DayDiffPipe implements PipeTransform {
    transform(value: { startDate?: string; endDate?: string; start_date?: string; end_date?: string }): number {
        if (value && value.startDate && value.endDate) {
            const date1 = dayjs(value.startDate)
            const date2 = dayjs(value.endDate)

            // return date2.diff(date1, 'day')
            return date2.diff(date1, 'day') + 1
        } else if (value && value.start_date && value.end_date) {
            const date1 = dayjs(value.start_date).format('YYYY-MM-DD')
            const date2 = dayjs(value.end_date).format('YYYY-MM-DD')

            // return date2.diff(date1, 'day')
            return dayjs(date2).diff(dayjs(date1), 'day') + 1
        } else {
            return 0
        }
    }
}
