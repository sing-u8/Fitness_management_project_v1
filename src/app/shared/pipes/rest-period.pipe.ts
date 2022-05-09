import { Pipe, PipeTransform } from '@angular/core'
import dayjs from 'dayjs'

@Pipe({
    name: 'restPeriod',
})
export class RestPeriodPipe implements PipeTransform {
    transform(endDate: string): number {
        const date1 = dayjs().format('YYYY-MM-DD')
        const date2 = dayjs(endDate).format('YYYY-MM-DD')

        return dayjs(date2).diff(dayjs(date1), 'day') + 1
    }
}
