import { Injectable, OnDestroy } from '@angular/core'

import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import _ from 'lodash'

import * as wsChat from '@schemas/web-socket/ws-chat'

import { StorageService } from '@services/storage.service'

// ngrx
import { Store, select } from '@ngrx/store'
import * as FromCommunity from '@centerStore/reducers/sec.community.reducer'
import * as CommunitySelector from '@centerStore/selectors/sec.community.selector'
import * as CommunityActions from '@centerStore/actions/sec.community.actions'
import { Subject, Subscription } from 'rxjs'
import { User } from '@schemas/user'

@Injectable({
    providedIn: 'root',
})
// @Injectable()
export class WsChatService implements OnDestroy {
    private readonly wss = 'wss://15s5c1lahf.execute-api.ap-northeast-2.amazonaws.com/prod'
    public chatWs: WebSocketSubject<any> = undefined
    public subscription: Subscription

    public user: User

    constructor(private nxStore: Store, private storageService: StorageService) {
        console.log('WsChatService chat service !!!!!!!!!')
        this.connect(this.wss)
    }
    ngOnInit(): void {
        console.log('-------------------------- WsChatService --------------------------------- ngOnInit')
    }
    ngOnDestroy(): void {
        console.log('-------------------------- WsChatService --------------------------------- onDestroy')
        this.closeChatWs()
    }

    connect(url: string): WebSocketSubject<any> {
        console.log(`WsChatService connect chatWs : `, this.chatWs)
        this.user = this.storageService.getUser()
        if (!this.chatWs) {
            this.chatWs = webSocket(this.wss)
            console.log('rxjs webSocket connected: ' + url)
        }
        if (!_.isEmpty(this.user) && this.user.access_token) {
            console.log('WsChatService connect subscribe chat ws ')
            this.subscribeChatWs(this.user.access_token)
        }
        return this.chatWs
    }

    subscribeChatWs(accessToken: string) {
        console.log('subscribeChatWs - ', accessToken)

        this.chatWs.subscribe({
            next: (ws) => {
                console.log('web socket chat next : ', ws)
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
        if (this.subscription) {
            this.subscription.unsubscribe()
        }
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
