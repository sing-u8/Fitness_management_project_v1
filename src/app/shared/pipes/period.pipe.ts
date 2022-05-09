import { Pipe, PipeTransform } from '@angular/core'
import dayjs from 'dayjs'

@Pipe({
    name: 'period',
})
export class PeriodPipe implements PipeTransform {
    transform(startDate: string, endDate: string): number {
        const date1 = dayjs(startDate).format('YYYY-MM-DD')
        const date2 = dayjs(endDate).format('YYYY-MM-DD')

        return dayjs(date2).diff(dayjs(date1), 'day') + 1
    }
}
