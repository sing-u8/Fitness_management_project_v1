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
            return !value[1]
                ? dayjs(value[0]).format('YYYY.MM.DD')
                : dayjs(value[0]).format('YYYY.MM.DD') + ' - ' + dayjs(value[1]).format('YYYY.MM.DD')
        } else {
            return ''
        }
    }
}
