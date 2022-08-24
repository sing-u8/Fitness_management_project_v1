import { Injectable } from '@angular/core'
import _ from 'lodash'

@Injectable({
    providedIn: 'root',
})
export class WordService {
    constructor() {}

    ellipsis(word: string, to: number) {
        if (word.length > to) {
            return word.slice(0, to) + '...'
        } else {
            return word
        }
    }

    getTextByte(text: string): number {
        let b
        let i
        let c
        for (b = i = 0; (c = text.charCodeAt(i++)); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
        return b
    }
}
