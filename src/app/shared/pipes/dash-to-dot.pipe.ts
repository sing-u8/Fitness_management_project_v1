import { Pipe, PipeTransform } from '@angular/core'
import _ from 'lodash'
@Pipe({
    name: 'dashToDot',
})
export class DashToDotPipe implements PipeTransform {
    transform(value) {
        if (_.isEmpty(value)) {
            return null
        }
        return String(value)
            .split('-')
            .reduce((pre, cur, idx) => {
                if (idx == 0) {
                    return pre + cur
                } else {
                    return pre + '.' + cur
                }
            }, '')
    }
}
