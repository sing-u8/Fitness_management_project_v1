import { Component, OnInit } from '@angular/core'

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
}
