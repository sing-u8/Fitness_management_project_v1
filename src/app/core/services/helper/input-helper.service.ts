import { Injectable } from '@angular/core'
import _ from 'lodash'

@Injectable({
    providedIn: 'root',
})
export class InputHelperService {
    constructor() {}

    restrictToNumber(event) {
        const code = event.which ? event.which : event.keyCode
        return !(code < 48 || code > 57)
    }
}
