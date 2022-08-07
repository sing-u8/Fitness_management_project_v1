import { Pipe, PipeTransform } from '@angular/core'
import dayjs from 'dayjs'

@Pipe({
    name: 'isAfter',
})
export class IsAfterPipe implements PipeTransform {
    transform(value: string, unit: dayjs.OpUnitType = 'day'): boolean {
        return dayjs(value).isAfter(dayjs(), unit)
    }
}
