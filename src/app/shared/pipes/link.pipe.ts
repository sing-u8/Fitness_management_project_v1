import { Pipe, PipeTransform } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'

@Pipe({ name: 'link' })
export class LinkPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}

    transform(text) {
        return this.createTextLinks(text)
    }

    createTextLinks(text) {
        const regex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi
        const replacer = (match) => {
            return `<a href=${match} target="_blank">${match}</a>`
        }
        return (text || '').replace(regex, replacer)
    }
}
