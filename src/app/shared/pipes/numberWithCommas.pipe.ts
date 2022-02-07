import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'numberWithCommas' })
export class numberWithCommasPipe implements PipeTransform {
    constructor() {}

    transform(x) {
        if (!x) {
            return 0
        }
        x = x.toString().replace(/[^0-9]/gi, '')
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
}
