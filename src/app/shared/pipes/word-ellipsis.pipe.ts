import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'wordEllipsis',
})
export class WordEllipsisPipe implements PipeTransform {
    transform(value: string, ellipsisTo: number): unknown {
        if (value) {
            return value.slice(0, ellipsisTo)
        }
        return null
    }
}
