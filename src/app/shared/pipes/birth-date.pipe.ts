import { Pipe, PipeTransform } from '@angular/core'
import dayjs from 'dayjs'

@Pipe({
    name: 'birthDate',
})
export class BirthDatePipe implements PipeTransform {
    transform(value: string, additionString: string): string {
        if (!value) return null
        return additionString
            ? String(dayjs().diff(value, 'year') + 1) + additionString
            : String(dayjs().diff(value, 'year') + 1)
    }
}
