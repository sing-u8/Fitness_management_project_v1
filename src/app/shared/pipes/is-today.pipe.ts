import { Pipe, PipeTransform } from '@angular/core'
import dayjs from 'dayjs'
import _ from 'lodash'

@Pipe({ name: 'isToday' })
export class IsTodayPipe implements PipeTransform {
    constructor() {}

    transform(value: string) {
        // const time = moment(value, 'HH:mm:ss').format('hh/mm/a')
        if (_.isEmpty(value)) {
            return false
        }
        return dayjs().isSame(dayjs(value), 'day')
    }
}
