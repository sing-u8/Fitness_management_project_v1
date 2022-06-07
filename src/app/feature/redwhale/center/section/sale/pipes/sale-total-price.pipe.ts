import { Pipe, PipeTransform } from '@angular/core'
import { StatsSales } from '@schemas/stats-sales'
import * as _ from 'lodash'

@Pipe({
    name: 'saleTotalPrice',
})
export class SaleTotalPricePipe implements PipeTransform {
    transform(value: StatsSales): string {
        return String(value.card + value.cash + value.trans + value.unpaid).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
}
