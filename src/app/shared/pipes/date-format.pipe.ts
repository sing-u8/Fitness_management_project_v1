import { Pipe, PipeTransform } from '@angular/core'
import dayjs from 'dayjs'
import _ from 'lodash'

@Pipe({
    name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
    transform(date: string | number, format: string): unknown {
        if (_.isNumber(date)) {
            date = String(date)
        }
        return dayjs(date).format(format)
    }
}
