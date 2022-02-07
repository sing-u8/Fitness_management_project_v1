import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'dashToDot',
})
export class DashToDotPipe implements PipeTransform {
    transform(value) {
        return String(value)
            .split('-')
            .reduce((pre, cur, idx) => {
                if (idx == 0) {
                    return pre + cur
                } else {
                    return pre + '.' + cur
                }
            }, '')
    }
}
