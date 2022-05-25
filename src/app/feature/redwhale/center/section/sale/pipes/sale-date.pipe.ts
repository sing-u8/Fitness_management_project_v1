import { Pipe, PipeTransform } from '@angular/core'
import * as _ from 'lodash'

@Pipe({
    name: 'saleDate',
})
export class SaleDatePipe implements PipeTransform {
    transform(value: string | [string, string]): string {
        if (_.isString(value)) {
            return value
        } else if (_.isArray(value)) {
            return !value[1] ? value[0] : value[0] + ' - ' + value[1]
        } else {
            return ''
        }
    }
}
