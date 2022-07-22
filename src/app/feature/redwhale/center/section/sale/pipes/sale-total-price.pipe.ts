import { Pipe, PipeTransform } from '@angular/core'
import { StatsSales } from '@schemas/stats-sales'
import * as _ from 'lodash'

@Pipe({
    name: 'saleTotalPrice',
})
export class SaleTotalPricePipe implements PipeTransform {
    transform(value: StatsSales): string {
        const total = value.card + value.cash + value.trans + value.unpaid
        const prefix = value.type_code == 'payment_type_refund' && total > 0 ? '-' : ''
        return prefix + String(total).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
}
