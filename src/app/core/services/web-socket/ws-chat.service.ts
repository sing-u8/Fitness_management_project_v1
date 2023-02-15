import { Injectable, OnDestroy } from '@angular/core'

import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import _ from 'lodash'
import { environment } from '@environments/environment'

import * as wsChat from '@schemas/web-socket/web-socket'

import { StorageService } from '@services/storage.service'
import { DashboardHelperService } from '@services/center/dashboard-helper.service'
import { SoundService } from '@services/helper/sound.service'

// ngrx
import { Store } from '@ngrx/store'
import * as CommunityActions from '@centerStore/actions/sec.community.actions'
import * as DashboardAction from '@centerStore/actions/sec.dashboard.actions'
import { Subscription } from 'rxjs'
import { User } from '@schemas/user'

@Injectable({
    providedIn: 'root',
})
// @Injectable()
export class WsChatService implements OnDestroy {
    private readonly wss = environment.wss
    public chatWs: WebSocketSubject<any> = undefined
    public subscription: Subscription

    public user: User

    constructor(
        private nxStore: Store,
        private storageService: StorageService,
        private dashboardHelperService: DashboardHelperService,
        private soundService: SoundService
    ) {
        console.log('WsChatService chat service !!!!!!!!!')
        this.connect()
    }
    ngOnInit(): void {
        console.log('-------------------------- WsChatService --------------------------------- ngOnInit')
    }
    ngOnDestroy(): void {
        console.log('-------------------------- WsChatService --------------------------------- onDestroy')
        this.closeChatWs()
    }

    connect() {
        console.log(
            `WsChatService connect chatWs : `,
            this.chatWs,
            ' -- wss : ',
            this.wss,
            ' -- env : ',
            environment.production
        )
        this.user = this.storageService.getUser()
        if (!this.chatWs) {
            this.chatWs = webSocket(this.wss)
        }
        if (!_.isEmpty(this.user) && this.user.access_token) {
            console.log('WsChatService connect subscribe chat ws ')
            this.subscribeChatWs(this.user.access_token)
        }
        return this.chatWs
    }

    subscribeChatWs(accessToken: string) {
        console.log('subscribe chat ws : ')
        this.chatWs.subscribe({
            next: (ws) => {
                if (this.isCenterExist() && this.isCenterMessage(ws)) {
                    console.log('this is center chat ws : ', ws)
                    this.switchByWsChatBase(ws as wsChat.Base)
                }
                if (this.isCenterExist() && this.isCenterTouchPad(ws)) {
                    console.log('this is center touch pad ws : ', ws)
                    this.switchBtWsTouchPad(ws as wsChat.Base)
                }
            },
            error: (err) => {
                console.log('web socket chat error : ', err)
            },
            complete: () => {
                console.log('web socket chat complete! -- err 발생 구간')
                this.connect()
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
    isCenterExist() {
        return !_.isEmpty(this.storageService.getCenter())
    }
    isCenterMessage(ws: wsChat.Base) {
        return ws.info.center_id == this.storageService.getCenter()?.id
    }
    isCenterTouchPad(ws: wsChat.Base) {
        return ws.info.center_id == this.storageService.getCenter()?.id
    }

    switchByWsChatBase(ws: wsChat.Base) {
        console.log(' switchByWsChatBase -- ', ws)
        if (ws.topic == 'chat_room' && ws.operation == 'create') {
            this.nxStore.dispatch(CommunityActions.createChatRoomByWS({ ws_data: ws as wsChat.CreateChatRoom }))
        } else if (ws.topic == 'chat_room' && ws.operation == 'read') {
            this.nxStore.dispatch(CommunityActions.readChatRoomByWS({ ws_data: ws as wsChat.ReadChatRoom }))
        } else if (ws.topic == 'chat_room' && ws.operation == 'update') {
            this.nxStore.dispatch(CommunityActions.updateChatRoomByWS({ ws_data: ws as wsChat.UpdateChatRoom }))
        } else if (ws.topic == 'chat_room_user' && ws.operation == 'delete') {
            console.log('switch by ws chat base -- delete chat room user : ', ws)
            this.nxStore.dispatch(
                CommunityActions.deleteChatRoomUserByWS({
                    ws_data: ws as wsChat.DeleteChatRoomUser,
                    cur_center_user: this.storageService.getCenterUser(),
                })
            )
        } else if (ws.topic == 'chat_room_user' && ws.operation == 'create') {
            this.nxStore.dispatch(CommunityActions.createChatRoomUserByWS({ ws_data: ws as wsChat.CreateChatRoomUser }))
        } else if (ws.topic == 'chat_room_message' && ws.operation == 'create') {
            this.nxStore.dispatch(
                CommunityActions.startCreateChatRoomMsgByWS({
                    ws_data: ws as wsChat.CreateChatRoomMessage,
                    curCenterUser: this.storageService.getCenterUser(),
                })
            )
        } else if (ws.topic == 'chat_room_message' && ws.operation == 'delete') {
            // ! 아직 기획에서 보이지 않음
            this.nxStore.dispatch(
                CommunityActions.deleteChatRoomMsgByWS({ ws_data: ws as wsChat.DeleteChatRoomMessage })
            )
        }
    }

    switchBtWsTouchPad(ws: wsChat.Base) {
        console.log('switchBtWsTouchPad -- ', ws)
        if (ws.topic == 'touchpad' && ws.operation == 'call') {
            console.log('switchBtWsTouchPad -- touchpad : call ', ws)
            this.soundService.callEmployee()
            // this.nxStore.dispatch(CommunityActions.createChatRoomByWS({ ws_data: ws as wsChat.touchPadCall }))
        } else if (ws.topic == 'touchpad' && ws.operation == 'check_in') {
            console.log('switchBtWsTouchPad -- touchpad : check_in ', ws)
            this.nxStore.dispatch(DashboardAction.showAttendanceToast({ visible: true, centerUser: ws.dataset[0] }))
            this.dashboardHelperService.synchronizeCheckIn(ws.info.center_id, ws.dataset[0])
            this.dashboardHelperService.synchronizeCheckInDrawer(ws.info.center_id, ws.dataset[0])
            // this.nxStore.dispatch(CommunityActions.readChatRoomByWS({ ws_data: ws as wsChat.touchPadCheckIn }))
        }
    }
}
