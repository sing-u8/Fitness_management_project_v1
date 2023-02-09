import { Pipe, PipeTransform } from '@angular/core'
import _ from 'lodash'

@Pipe({
    name: 'phoneNumber',
})
export class PhoneNumberPipe implements PipeTransform {
    transform(value: unknown, ...args: unknown[]): unknown {
        if (_.isEmpty(value) || value == '-') {
            return '-'
        }
        let phoneNum: string = String(value).replace(/\D[^\.]/g, '')
        if (phoneNum.length < 11) {
            phoneNum = phoneNum.slice(0, 3) + '-' + phoneNum.slice(3, 6) + '-' + phoneNum.slice(6)
        } else {
            phoneNum = phoneNum.slice(0, 3) + '-' + phoneNum.slice(3, 7) + '-' + phoneNum.slice(7)
        }
        return phoneNum
    }
}
