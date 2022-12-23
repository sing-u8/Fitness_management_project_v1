import { Pipe, PipeTransform } from '@angular/core'
import _ from 'lodash'

@Pipe({
    name: 'wordEllipsis',
})
export class WordEllipsisPipe implements PipeTransform {
    transform(value: string, ellipsisTo: number): string {
        if (value && value.length > ellipsisTo) {
            return value.slice(0, ellipsisTo) + '...'
        } else {
            return value
        }
    }
}
