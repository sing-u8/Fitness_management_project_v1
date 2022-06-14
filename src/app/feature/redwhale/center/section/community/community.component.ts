import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    ElementRef,
    Renderer2,
    AfterViewInit,
    ViewChildren,
    QueryList,
} from '@angular/core'
import { Router } from '@angular/router'
import { FormBuilder, FormControl, Validators, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms'
import { HttpEvent, HttpEventType } from '@angular/common/http'

import dayjs from 'dayjs'
import _ from 'lodash'
import { Subject, Subscription, Observable } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { CenterUser } from '@schemas/center-user'
import { User } from '@schemas/user'
import { Center } from '@schemas/center'
import { ChatRoom } from '@schemas/chat-room'
import { ChatRoomMessage } from '@schemas/chat-room-message'
import { ChatRoomUser } from '@schemas/chat-room-user'

import { StorageService } from '@services/storage.service'
import * as CenterChatRoomApi from '@services/center-chat-room.service'

// ngrx
import { Store, select } from '@ngrx/store'
import { drawerSelector } from '@appStore/selectors'
import { showToast } from '@appStore/actions/toast.action'

import * as FromCommunity from '@centerStore/reducers/sec.community.reducer'
import * as CommunitySelector from '@centerStore/selectors/sec.community.selector'
import * as CommunityActions from '@centerStore/actions/sec.community.actions'

@Component({
    selector: 'community',
    templateUrl: './community.component.html',
    styleUrls: ['./community.component.scss'],
})
export class CommunityComponent implements OnInit, OnDestroy, AfterViewInit {
    public chatInput: FormControl
    public user: User
    public center: Center

    // ngrx vars
    public chatRoomList$ = this.nxStore.select(CommunitySelector.chatRoomList)

    public curChatRoom$ = this.nxStore.select(CommunitySelector.mainCurChatRoom)
    public chatRoomUserList$ = this.nxStore.select(CommunitySelector.mainChatRoomUserList)
    public chatRoomMsgs$ = this.nxStore.select(CommunitySelector.mainChatRoomMsgs)

    public unsubscribe$ = new Subject<void>()

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private renderer: Renderer2,
        private storageService: StorageService,
        private nxStore: Store
    ) {
        this.chatInput = this.fb.control('', { validators: [Validators.required, this.inputValidator()] })
        this.changeRoomInput = this.fb.control('', { validators: [Validators.required, this.inputValidator()] })

        this.center = this.storageService.getCenter()
        this.user = this.storageService.getUser()

        this.nxStore
            .pipe(select(CommunitySelector.curCenterId), takeUntil(this.unsubscribe$))
            .subscribe((curCenterId) => {
                if (curCenterId != this.center.id) {
                    this.nxStore.dispatch(CommunityActions.resetAll())
                    this.nxStore.dispatch(CommunityActions.startGetChatRooms({ centerId: this.center.id }))
                }
            })

        this.nxStore.dispatch(CommunityActions.setCurCenterId({ centerId: this.center.id }))
    }

    ngOnInit(): void {}
    ngAfterViewInit(): void {}
    ngOnDestroy(): void {}

    // addfile button vars and func
    public addBtSrcObj = { leave: 'assets/icons/etc/plus-grey.svg', hover: 'assets/icons/etc/plus-red.svg' }
    public addBtSrc = 'assets/icons/etc/plus-grey.svg'
    addFileBtMouseLeave() {
        this.addBtSrc = this.addBtSrcObj.leave
    }
    addFileBtMouseHover() {
        this.addBtSrc = this.addBtSrcObj.hover
    }
    // <-----------------------------------

    // functions related to room
    createChatRoom(selectedMembers: Array<CenterUser>) {
        const user_ids = selectedMembers.map((v) => v.id)
        user_ids.push(this.user.id)
        this.nxStore.dispatch(
            CommunityActions.startCreateChatRoom({
                centerId: this.center.id,
                reqBody: {
                    user_ids: user_ids,
                    type_code: 'chat_room_type_general',
                },
                spot: 'main',
            })
        )
    }
    // <-----------------------------------

    // modal vars and fucntions

    // - // 채팅방 입장
    public joinRoom(chatRoom: ChatRoom) {
        this.nxStore.dispatch(
            CommunityActions.startJoinChatRoom({ centerId: this.center.id, chatRoom: chatRoom, spot: 'main' })
        )
    }

    // - // 채팅방 생성
    public doShowCreateRoomModal = false
    showCreateRoomModal() {
        this.doShowCreateRoomModal = true
    }
    hideCreateRoomModal() {
        this.doShowCreateRoomModal = false
    }
    onCreateRoomConfirm(members: Array<CenterUser>) {
        this.hideCreateRoomModal()
        this.createChatRoom(members)
    }

    // - // 채팅방 초대
    public doShowInviteUserModal = false
    showInviteUserModal() {
        this.doShowInviteUserModal = true
    }
    hideInviteUserModal() {
        this.doShowInviteUserModal = false
    }
    onInviteUserConfirm(members: Array<CenterUser>) {
        console.log('onInviteUserConfirm: ', members)
        this.hideInviteUserModal()
        this.createChatRoom(members)
    }

    // - // 채팅방 나가기
    public showLeaveRoomDropdown = false
    toggleLeaveRoomDropdown() {
        this.showLeaveRoomDropdown = !this.showLeaveRoomDropdown
    }
    closeLeaveRoomDropdown() {
        this.showLeaveRoomDropdown = false
    }
    public showLeaveRoomModal = false
    public showLeaveRoomModalText = {
        text: '채팅방에서 나가시겠어요?',
        subText: `채팅방에서 나갈 경우,
                기존의 채팅 내역이 삭제되며 복구하실 수 없어요.`,
        cancelButtonText: '취소',
        confirmButtonText: '나가기',
    }
    openLeaveRoomModal() {
        this.showLeaveRoomModal = true
    }
    closeLeaveRoomModal() {
        this.showLeaveRoomModal = false
    }
    leaveRoomModalConfirm() {
        // !! 임시 채팅방일 때와 생성된 채팅방 구분해서 호출하기
        this.nxStore.dispatch(CommunityActions.startLeaveChatRoom({ centerId: this.center.id, spot: 'main' }))
        this.closeLeaveRoomModal()
    }

    // - // 채팅방 이름 바꾸기
    public doShowChangeRoomNameModal = false
    public changeRoomNameText = {
        text: '채팅방 이름을 변경하시겠어요?',
        subText: `변경한 채팅방 이름은
                채팅 참여자에게 모두 동일하게 적용됩니다.`,
        cancelButtonText: '취소',
        confirmButtonText: '이름 변경',
    }
    showChangeRoomNameModal() {
        this.doShowChangeRoomNameModal = true
    }
    hidehangeRoomNameModal() {
        this.doShowChangeRoomNameModal = false
    }
    public changeRoomMode = false
    public changeRoomInput: FormControl
    confirmChangeRoomNameModal() {
        // this.changeRoomInput.setValue(this.selectedRoom.value.name)
        this.changeRoomMode = true
        this.hidehangeRoomNameModal()
    }
    changeRoomName(newName: string, inputValid: boolean) {
        if (inputValid) {
            const trimName = _.trim(newName)
            this.nxStore.dispatch(
                CommunityActions.startUpdateChatRoomName({
                    centerId: this.center.id,
                    reqBody: { name: trimName },
                    spot: 'main',
                })
            )
        }
        this.resetChangeRoomNameData()
    }
    resetChangeRoomNameData() {
        this.changeRoomMode = false
        this.changeRoomInput.setValue('')
    }
    // <---------------------

    // chat room userList dropdown
    public showRoomUserList = false
    public isRoomHost = false
    toggleRoomUserListDropDown() {
        this.showRoomUserList = !this.showRoomUserList
    }
    closeRoomUserListDropDown() {
        this.showRoomUserList = false
    }
    initRoomUserList(userIdList: string[]) {
        this.checkIsRoomHost()
        // const isMe: GymUser = this.gymCommunityState.getValueFromUserMapState(this.user.id)
        // const inviteeList: GymUser[] = userIdList
        //     .filter((userId) => userId != this.user.id)
        //     .map((userId) => this.gymCommunityState.getValueFromUserMapState(userId))
        //     .sort()
        // this.roomUserList = [isMe, ...inviteeList]
    }
    checkIsRoomHost() {
        // if (this.selectedRoom.value.type == 'dm') {
        //     this.isRoomHost = false
        // } else if (this.selectedRoom.value.id == 'general') {
        //     // ! 공지사항일 때 회원초대 상태 -- 추후에 수정하기
        //     this.isRoomHost = false
        // } else {
        //     // roomid ex -> group@2b08c5ba-8c7a-11eb-b321-020f65958450#1634735919449
        //     const hostId = this.selectedRoom.value.id.split('@')[1].split('#')[0]
        //     this.isRoomHost = this.user.id == hostId
        // }
    }
    // <---------------------

    //

    // - // chatInput fucntions and validator, chat-message component helper tag vars  //!! 더 추가 필요
    @ViewChild('chatting_screen') chatting_screen: ElementRef
    @ViewChild('chatting_input') chatting_input: ElementRef
    @ViewChildren('message_el') message_el: QueryList<any>

    inputValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!_.trim(control.value)) {
                return { emptyString: true }
            }
            return null
        }
    }
    // <---------------------
}
