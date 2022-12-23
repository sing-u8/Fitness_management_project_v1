import { Injectable } from '@angular/core'
import _ from 'lodash'

@Injectable({
    providedIn: 'root',
})
export class InputHelperService {
    constructor() {}

    restrictToNumber(event) {
        const code = event.which ? event.which : event.keyCode
        // 8: backspace, 37: <- , 39: ->, 13: enter, 9: tab
        return (
            (code >= 48 && code <= 57) ||
            (code >= 96 && code <= 105) ||
            code == 8 ||
            code == 39 ||
            code == 37 ||
            code == 13 ||
            code == 9
        )
    }
}
