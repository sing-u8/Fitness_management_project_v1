import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'filterZeroPayment',
})
export class FilterZeroPaymentPipe implements PipeTransform {
    transform(value: any): unknown {
        return value.card + value.trans + value.unpaid + value.cash != 0
    }
}
