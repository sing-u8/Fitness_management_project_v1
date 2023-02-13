import { createSelector } from '@ngrx/store'
import { GymFeature, GymState } from './sec.selector'
import * as FromCommunity from '@centerStore/reducers/sec.community.reducer'
import { selectUnreadMessageNumber } from '@centerStore/reducers/sec.community.reducer'

export const FeatureKey = 'Center/Community'
export const CommunityFeature = createSelector(GymFeature, (state: GymState) => state[FeatureKey])

// main
export const chatRoomList = createSelector(CommunityFeature, FromCommunity.selectChatRoomList)
export const unreadMessageNumber = createSelector(CommunityFeature, FromCommunity.selectUnreadMessageNumber)

// main - screen = main
export const mainIsJoinRoomLoading = createSelector(CommunityFeature, FromCommunity.selectMainIsJoinRoomLoading)
export const mainPreChatRoom = createSelector(CommunityFeature, FromCommunity.selectMainPreChatRoom)
export const mainCurChatRoom = createSelector(CommunityFeature, FromCommunity.selectMainCurChatRoom)
export const mainChatRoomMsgs = createSelector(CommunityFeature, FromCommunity.selectMainChatRoomMsgs)
export const mainChatRoomMsgEnd = createSelector(CommunityFeature, FromCommunity.selectMainChatRoomMsgEnd)
export const mainChatRoomMsgLoading = createSelector(CommunityFeature, FromCommunity.selectMainChatRoomMsgLoading)
export const mainChatRoomLoadingMsgs = createSelector(CommunityFeature, FromCommunity.selectMainChatRoomLoadingMsgs)
export const mainChatRoomUserList = createSelector(CommunityFeature, FromCommunity.selectMainChatRoomUserList)
// main - rawer
export const drawerIsJoinRoomLoading = createSelector(CommunityFeature, FromCommunity.selectDrawerIsJoinRoomLoading)
export const drawerPreChatRoom = createSelector(CommunityFeature, FromCommunity.selectDrawerPreChatRoom)
export const drawerCurChatRoom = createSelector(CommunityFeature, FromCommunity.selectDrawerCurChatRoom)
export const drawerChatRoomMsgs = createSelector(CommunityFeature, FromCommunity.selectDrawerChatRoomMsgs)
export const drawerChatRoomMsgEnd = createSelector(CommunityFeature, FromCommunity.selectDrawerChatRoomMsgEnd)
export const drawerChatRoomMsgLoading = createSelector(CommunityFeature, FromCommunity.selectDrawerChatRoomMsgLoading)
export const drawerChatRoomLoadingMsgs = createSelector(CommunityFeature, FromCommunity.selectDrawerChatRoomLoadingMsgs)
export const drawerChatRoomUserList = createSelector(CommunityFeature, FromCommunity.selectDrawerChatRoomUserList)
export const drawerJoinedChatRoom = createSelector(CommunityFeature, FromCommunity.selectDrawerJoinedChatRoom)

// common
export const curCenterId = createSelector(CommunityFeature, FromCommunity.selectCurCenterId)
export const drawerCurCenterId = createSelector(CommunityFeature, FromCommunity.selectDrawerCurCenterId)
export const isLoading = createSelector(CommunityFeature, FromCommunity.selectIsLoading)
export const drawerIsLoading = createSelector(CommunityFeature, FromCommunity.selectDrawerIsLoading)
export const error = createSelector(CommunityFeature, FromCommunity.selectError)

// etc
export const curMainChatRoomIsTemp = createSelector(CommunityFeature, FromCommunity.selectCurMainChatRoomIsTemp)
export const curDrawerChatRoomIsTemp = createSelector(CommunityFeature, FromCommunity.selectCurDrawerChatRoomIsTemp)

// by dashboard
export const curChatLoaded = createSelector(
    CommunityFeature,
    (state: FromCommunity.State): FromCommunity.CurChatLoaded => {
        return {
            main: {
                isLoading: state.isLoading,
                curCenterId: state.curCenterId,
            },
            drawer: {
                isLoading: state.drawerIsLoading,
                curCenterId: state.drawerCurCenterId,
            },
        }
    }
)
