import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'trimText',
})
export class TrimTextPipe implements PipeTransform {
    transform(value: string): string {
        return value.trim()
    }
}
