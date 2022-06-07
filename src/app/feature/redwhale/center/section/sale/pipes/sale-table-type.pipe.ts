import { Pipe, PipeTransform } from '@angular/core'

type Type = 'user_membership' | 'user_locker'

@Pipe({
    name: 'saleTableType',
})
export class SaleTableTypePipe implements PipeTransform {
    transform(value: Type): string {
        switch (value) {
            case 'user_locker':
                return '락커'
            case 'user_membership':
                return '회원권'
        }
    }
}
