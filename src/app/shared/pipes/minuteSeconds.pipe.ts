import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'minuteSeconds' })
export class MinuteSecondsPipe implements PipeTransform {
    constructor() {}

    transform(value: number) {
        const minutes = Math.floor(value / 60)
        const seconds = value - minutes * 60

        const _minutes = String(minutes).length == 1 ? '0' + minutes : minutes
        const _seconds = String(seconds).length == 1 ? '0' + seconds : seconds
        return _minutes + ':' + _seconds
    }
}
