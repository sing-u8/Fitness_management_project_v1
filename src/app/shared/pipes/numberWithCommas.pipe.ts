import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'numberWithCommas' })
export class numberWithCommasPipe implements PipeTransform {
    constructor() {}

    transform(x) {
        let isNegative = false
        if (!x) {
            return 0
        }
        if (x < 0) {
            isNegative = true
        }
        x = x.toString().replace(/[^0-9]/gi, '')
        return (isNegative ? '-' : '') + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
}
