import { Injectable } from '@angular/core'

import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import _ from 'lodash'

import * as wsChat from '@schemas/web-socket/ws-chat'

import { StorageService } from '@services/storage.service'

// ngrx
import { Store, select } from '@ngrx/store'
import * as FromCommunity from '@centerStore/reducers/sec.community.reducer'
import * as CommunitySelector from '@centerStore/selectors/sec.community.selector'
import * as CommunityActions from '@centerStore/actions/sec.community.actions'
import { Subject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class WsChatService {
    private readonly wss = 'wss://15s5c1lahf.execute-api.ap-northeast-2.amazonaws.com/prod'
    public chatWs: WebSocketSubject<any> = undefined
    public wsTest = new WebSocket(this.wss)

    constructor(private nxStore: Store) {
        console.log('webSocket chat service !!!!!!!!!')
        this.connect(this.wss)
    }

    connect(url: string): WebSocketSubject<any> {
        if (!this.chatWs) {
            this.chatWs = webSocket(this.wss)
            this.chatWs
            console.log('rxjs webSocket connected: ' + url)
        }
        return this.chatWs
    }

    subscribeChatWs(accessToken: string) {
        console.log('subscribeChatWs - ', accessToken)
        this.chatWs.subscribe({
            next: (ws) => {
                this.switchByWsChatBase(ws as wsChat.Base)
            },
            error: (err) => {
                console.log('web socket chat error : ', err)
            },
            complete: () => {
                console.log('web socket chat complete!')
            },
        })

        this.chatWs.next({
            action: 'subscription',
            accessToken: accessToken,
        })
    }

    closeChatWs() {
        console.log('close chat ws')
        this.chatWs.complete()
        // this.wsTest.close()
    }

    // helper
    switchByWsChatBase(ws: wsChat.Base) {
        console.log(' switchByWsChatBase -- ', ws)
        if (ws.topic == 'chat_room' && ws.operation == 'create') {
        } else if (ws.topic == 'chat_room' && ws.operation == 'create') {
        } else if (ws.topic == 'chat_room_user' && ws.operation == 'delete') {
        } else if (ws.topic == 'chat_room_message' && ws.operation == 'create') {
        } else if (ws.topic == 'chat_room_message' && ws.operation == 'delete') {
        }
    }
}
