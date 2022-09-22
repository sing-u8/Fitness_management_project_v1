import { Injectable } from '@angular/core'

import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { ChatRoom, IsTmepRoom } from '@schemas/chat-room'

import _ from 'lodash'
import { take } from 'rxjs/operators'

// ngrx
import { Store } from '@ngrx/store'
import * as CommunityReducer from '@centerStore/reducers/sec.community.reducer'
import * as CommunityActions from '@centerStore/actions/sec.community.actions'
import * as CommunitySelector from '@centerStore/selectors/sec.community.selector'

@Injectable({
    providedIn: 'root',
})
export class CommunityHelperService {
    constructor(private nxStore: Store) {}

    createOneToOneChatRoomByDashboard(
        openSpot: CommunityReducer.spot,
        center: Center,
        chatUser: CenterUser,
        curUser: CenterUser
    ) {
        let mainLoaded: CommunityReducer.ChatLoaded = undefined
        let drawerLoaded: CommunityReducer.ChatLoaded = undefined
        this.nxStore
            .select(CommunitySelector.curMainChatLoaded)
            .pipe(take(1))
            .subscribe((loaded) => {
                mainLoaded = loaded
            })
        this.nxStore
            .select(CommunitySelector.curDrawerChatLoaded)
            .pipe(take(1))
            .subscribe((loaded) => {
                drawerLoaded = loaded
            })

        console.log(
            'createOneToOneChatRoomByDashboard :: ',
            mainLoaded,
            ' - ',
            drawerLoaded,
            ' --- ',
            (mainLoaded.isLoading == 'done' && mainLoaded.curCenterId == center.id) ||
                (drawerLoaded.isLoading == 'done' && drawerLoaded.curCenterId == center.id)
        )

        if (
            (mainLoaded.isLoading == 'done' && mainLoaded.curCenterId == center.id) ||
            (drawerLoaded.isLoading == 'done' && drawerLoaded.curCenterId == center.id)
        ) {
            console.log('createOneToOneChatRoomByDashboard == A')
            this.setCurCenterId(openSpot, center.id)
            this.nxStore
                .select(CommunitySelector.chatRoomList)
                .pipe(take(1))
                .subscribe((chatRooms) => {
                    this.determineJoinOrCreate(center, openSpot, chatRooms, chatUser, curUser)
                })
        } else {
            console.log('createOneToOneChatRoomByDashboard == B')
            this.setCurCenterId(openSpot, center.id)
            this.nxStore.dispatch(
                CommunityActions.startGetChatRoomsByDashboard({
                    openSpot,
                    centerId: center.id,
                    cb: (crs) => {
                        this.determineJoinOrCreate(center, openSpot, crs, chatUser, curUser)
                    },
                })
            )
        }
    }

    // helper
    setCurCenterId(openSpot: CommunityReducer.spot, centerId: string) {
        if (openSpot == 'main') {
            this.nxStore.dispatch(CommunityActions.setCurCenterId({ centerId: centerId }))
        } else if (openSpot == 'drawer') {
            this.nxStore.dispatch(CommunityActions.setDrawerCurCenterId({ centerId: centerId }))
        }
    }

    determineJoinOrCreate(
        center: Center,
        openSpot: CommunityReducer.spot,
        chatRooms: Array<ChatRoom>,
        chatUser: CenterUser,
        curUser: CenterUser
    ) {
        const existSameRoom: ChatRoom = _.find(chatRooms, (v) => {
            return v.chat_room_users.length == 1 && _.differenceBy(v.chat_room_users, [chatUser], 'id').length == 0
        })

        if (existSameRoom == undefined) {
            this.nxStore.dispatch(
                CommunityActions.createTempChatRoom({
                    center: center,
                    members: [chatUser],
                    curUser: curUser,
                    spot: openSpot,
                })
            )
        } else {
            if (_.includes(existSameRoom.id, IsTmepRoom)) {
                this.nxStore.dispatch(CommunityActions.joinTempChatRoom({ chatRoom: existSameRoom, spot: openSpot }))
            } else {
                this.nxStore.dispatch(
                    CommunityActions.startJoinChatRoom({ centerId: center.id, chatRoom: existSameRoom, spot: openSpot })
                )
            }
        }
    }
}
