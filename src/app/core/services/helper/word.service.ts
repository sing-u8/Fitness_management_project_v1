import { Injectable } from '@angular/core'
import _ from 'lodash'

@Injectable({
    providedIn: 'root',
})
export class WordService {
    constructor() {}

    ellipsis(word: string, to: number) {
        if (word.length > to) {
            return _.slice(word, 0, to) + '...'
        } else {
            return word
        }
    }
}
