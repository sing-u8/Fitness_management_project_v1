import { Component, OnInit } from '@angular/core'
import dayjs from 'dayjs'
type MessageRoute = 'general' | 'auto-transmission' | 'history'

@Component({
    selector: 'rw-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
    public messageRoute: MessageRoute = 'general'
    setMessageRoute(mr: MessageRoute) {
        this.messageRoute = mr
    }

    constructor() {}

    ngOnInit(): void {}

    // message route : general
    public generalTransmissionTime = {
        immediate: true,
        book: false,
    }
    onGeneralTransmissionTimeClick(type: 'immediate' | 'book') {
        if (type == 'immediate') {
            this.generalTransmissionTime.immediate = true
            this.generalTransmissionTime.book = false
        } else if (type == 'book') {
            this.generalTransmissionTime.immediate = false
            this.generalTransmissionTime.book = true
        }
    }

    public bookDateText: string = dayjs().format('YYYY.MM.DD (ddd)')
    public bookDate = { date: dayjs().format('YYYY-MM-DD') }
    public showBookDate = false
    closeBookDate() {
        this.showBookDate = false
    }
    toggleBookDate() {
        this.showBookDate = !this.showBookDate
    }
    onBookDateChange(data: { date: string }) {
        this.bookDateText = dayjs(data.date).format('YYYY.MM.DD (ddd)')
    }

    public bookTime = '10:00:00'
    onBookTimeClick(time: { key: string; name: string }) {
        this.bookTime = time.key
    }

    // message route : auto-transmission

    // message route : history
}
