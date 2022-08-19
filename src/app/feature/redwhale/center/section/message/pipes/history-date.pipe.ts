import { Pipe, PipeTransform } from '@angular/core'
import _ from 'lodash'
import dayjs from 'dayjs'

@Pipe({
    name: 'historyDate',
})
export class HistoryDatePipe implements PipeTransform {
    transform(value: [string, string]): string {
        if (_.isArray(value)) {
            if (!_.isEmpty(value[1]) && dayjs(value[0]).isSame(dayjs(value[1]))) {
                return value[0]
            }
            return !value[1] ? value[0] : value[0] + ' - ' + value[1]
        } else {
            return ''
        }
    }
}
