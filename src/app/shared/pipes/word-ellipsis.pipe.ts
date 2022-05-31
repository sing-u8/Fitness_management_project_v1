import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'wordEllipsis',
})
export class WordEllipsisPipe implements PipeTransform {
    transform(value: string, ellipsisTo: number): unknown {
        if (value && value.length > ellipsisTo) {
            return value.slice(0, ellipsisTo) + '...'
        } else {
            return value
        }
    }
}
