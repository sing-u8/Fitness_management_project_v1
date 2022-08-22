import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'rateOfChange',
})
export class RateOfChangePipe implements PipeTransform {
    transform(value: number, to: number, isSign?: boolean): string {
        let returnValue = ''
        if (value - to > 0) {
            returnValue = to == 0 ? `100%` : `${Number(((value - to) / to) * 100).toFixed(0)}%`
            returnValue = isSign ? '+' + returnValue : returnValue
        } else if (value - to < 0) {
            returnValue = to == 0 ? `100%` : `${Number(((to - value) / to) * 100).toFixed(0)}%`
            returnValue = isSign ? '-' + returnValue : returnValue
        } else {
            returnValue = ''
        }
        return returnValue
    }
}
