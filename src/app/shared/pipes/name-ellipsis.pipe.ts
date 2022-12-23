import { Pipe, PipeTransform } from '@angular/core'
import _ from 'lodash'

@Pipe({
    name: 'nameEllipsis',
})
export class NameEllipsisPipe implements PipeTransform {
    transform(value: string, separator = ', ', connector = ', ', limit = 2): unknown {
        const stringArr = _.split(value, separator)
        if (stringArr.length > limit) {
            return _.join(stringArr, connector) + '...'
        } else {
            return _.join(stringArr, connector)
        }
    }
}
