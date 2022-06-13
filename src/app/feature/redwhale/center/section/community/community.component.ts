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
                console.log(
                    'DashboardSelector.curCenterId : ',
                    curCenterId != this.center.id,
                    curCenterId,
                    this.center.id
                )
                if (curCenterId != this.center.id) {
                    this.nxStore.dispatch(CommunityActions.resetAll())
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

    // <-----------------------------------

    // modal vars and fucntions

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
        // members.length == 1 ? this.createDmRoom(members) : this.createGroupRoom(members)
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
        // const addedUserIdList = this.addUserToSelectedRoom(members).map((roomUser) => roomUser.userId)
        // const mergedUserIdList = [...this.selectedRoom.value.userList, ...addedUserIdList]
        // this.sendInviteInfoMessage(members, this.selectedRoom.value.userList)
        // this.selectedRoom.value.userList.forEach((userId) => {
        //     this.firestoreService.updateUserRoom(userId, this.gym.id, this.selectedRoom.value.id, {
        //         userList: mergedUserIdList,
        //     })
        // })
        // this.selectedRoom.value.userList = mergedUserIdList
    }

    // - // 채팅방 나가기
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
        // if (this.selectedRoom.value?.isTempRoom == true) {
        //     this.leaveTempRoom(this.selectedRoom.value.id)
        // } else {
        //     this.leaveRoom()
        // }
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
            // this.firestoreService.updateUserRoom(this.user.id, this.gym.id, this.selectedRoom.value.id, {
            //     name: trimName,
            // })
        }
        this.resetChangeRoomNameData()
    }
    resetChangeRoomNameData() {
        this.changeRoomMode = false
        this.changeRoomInput.setValue('')
    }
    // <---------------------

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
