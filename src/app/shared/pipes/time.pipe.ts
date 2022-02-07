import { Pipe, PipeTransform } from '@angular/core'
import dayjs from 'dayjs'

@Pipe({ name: 'time' })
export class TimePipe implements PipeTransform {
    constructor() {}

    transform(value: string) {
        // const time = moment(value, 'HH:mm:ss').format('hh/mm/a')
        const time = dayjs(value).format('hh/mm/a')
        const timeArr = time.split('/')
        const amPm = timeArr[2] == 'am' ? '오전' : '오후'

        return `${amPm} ${timeArr[0]}:${timeArr[1]}`
    }
}
