import { Pipe, PipeTransform } from '@angular/core'

type Type = 'locker' | 'membership'

@Pipe({
    name: 'saleTableType',
})
export class SaleTableTypePipe implements PipeTransform {
    transform(value: Type): string {
        switch (value) {
            case 'locker':
                return '락커'
            case 'membership':
                return '회원권'
        }
    }
}
