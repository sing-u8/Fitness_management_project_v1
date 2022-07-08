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
import { Subject } from 'rxjs'
import { takeUntil, take } from 'rxjs/operators'

import { Loading } from '@schemas/store/loading'
import { CenterUser } from '@schemas/center-user'
import { User } from '@schemas/user'
import { Center } from '@schemas/center'
import { ChatRoom, IsTmepRoom } from '@schemas/chat-room'
import { ChatRoomMessage } from '@schemas/chat-room-message'
import { ChatFile } from '@schemas/center/community/chat-file'
import { ChatRoomUser } from '@schemas/chat-room-user'

import { Confirm as InviteConfirm } from '@shared/components/redwhale/community/invite-room-modal/invite-room-modal.component'

import { StorageService } from '@services/storage.service'
import { VideoProcessingService } from '@services/helper/video-processing-service.service'
import * as CenterChatRoomApi from '@services/center-chat-room.service'
import { CommonCommunityService } from '@services/helper/common-community.service'

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
    public isLoading$ = this.nxStore.select(CommunitySelector.isLoading)
    public isLoading_: Loading

    public chatRoomList$ = this.nxStore.select(CommunitySelector.chatRoomList)
    public chatRoomList_: Array<ChatRoom> = []

    public curChatRoom$ = this.nxStore.select(CommunitySelector.mainCurChatRoom)
    public curChatRoom_: ChatRoom = undefined
    public isCurChatRoomTemp$ = this.nxStore.select(CommunitySelector.curMainChatRoomIsTemp)

    public chatRoomUserList$ = this.nxStore.select(CommunitySelector.mainChatRoomUserList)

    public chatRoomMsgs$ = this.nxStore.select(CommunitySelector.mainChatRoomMsgs)
    public chatRoomMsgs_: ChatRoomMessage[] = []
    public chatRoomMsgLoading$ = this.nxStore.select(CommunitySelector.mainChatRoomMsgLoading)
    public chatRoomMsgLoading_ = false

    public chatRoomLoadingMsgs$ = this.nxStore.select(CommunitySelector.mainChatRoomLoadingMsgs)

    public unsubscribe$ = new Subject<void>()

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private renderer: Renderer2,
        private storageService: StorageService,
        private nxStore: Store,
        private videoProcessingService: VideoProcessingService,
        private commonCommunityService: CommonCommunityService
    ) {
        this.chatInput = this.fb.control('', { validators: [Validators.required, this.inputValidator()] })
        this.changeRoomInput = this.fb.control('', { validators: [Validators.required, this.inputValidator()] })

        this.center = this.storageService.getCenter()
        this.user = this.storageService.getUser()

        this.isLoading$.pipe(takeUntil(this.unsubscribe$)).subscribe((isLoading) => {
            this.isLoading_ = isLoading
        })

        this.chatRoomMsgLoading$.pipe(takeUntil(this.unsubscribe$)).subscribe((chatRoomMsgLoading) => {
            this.chatRoomMsgLoading_ = chatRoomMsgLoading
        })

        this.nxStore.pipe(select(CommunitySelector.curCenterId), take(1)).subscribe((curCenterId) => {
            if (curCenterId != this.center.id) {
                this.nxStore.dispatch(CommunityActions.resetAll())
                // !! 한 번 호출후에 호출하지 않기
                if (this.isLoading_ == 'idle') {
                    this.nxStore.dispatch(
                        CommunityActions.startGetChatRooms({
                            centerId: this.center.id,
                            curUserId: this.user.id,
                            spot: 'main',
                        })
                    )
                }
            }
        })

        this.nxStore.dispatch(CommunityActions.setCurCenterId({ centerId: this.center.id }))
        this.chatRoomMsgs$.pipe(takeUntil(this.unsubscribe$)).subscribe((crMsgs) => {
            this.chatRoomMsgs_ = crMsgs
        })
        this.curChatRoom$.pipe(takeUntil(this.unsubscribe$)).subscribe((curChatRoom) => {
            this.curChatRoom_ = curChatRoom
        })
        this.chatRoomList$.pipe(takeUntil(this.unsubscribe$)).subscribe((chatRoomList) => {
            this.chatRoomList_ = chatRoomList
        })
    }

    ngOnInit(): void {}
    ngAfterViewInit(): void {}
    ngOnDestroy(): void {}

    // input focused funcs and vars
    public isTextAreaFoucsed = false
    onTextAreaFocused() {
        this.isTextAreaFoucsed = true
        this.addBtSrc = this.addBtSrcObj.hover
    }
    onTextAreaBlur() {
        this.isTextAreaFoucsed = false
        this.addBtSrc = this.addBtSrcObj.leave
    }

    // addfile button vars and func
    public addBtSrcObj = { leave: 'assets/icons/etc/plus-grey.svg', hover: 'assets/icons/etc/plus-red.svg' }
    public addBtSrc = 'assets/icons/etc/plus-grey.svg'
    addFileBtMouseLeave() {
        if (this.isTextAreaFoucsed) return
        this.addBtSrc = this.addBtSrcObj.leave
    }
    addFileBtMouseHover() {
        this.addBtSrc = this.addBtSrcObj.hover
    }

    // file drag guide vars & func
    public showFileDragGuide = false
    onFileDragOver() {
        console.log('in chat drag Over !! ')
        this.showFileDragGuide = true
    }
    onFileDragLeave() {
        console.log('in chat drag leave !! ')
        this.showFileDragGuide = false
    }

    // file functions
    public fileList: Array<ChatFile> = []
    onFileDrop(files: FileList) {
        this.setFileToFileList(files)
    }
    onFilePickerChange(event: any) {
        const files: FileList = event.files
        this.setFileToFileList(files)
    }

    async setFileToFileList(files: FileList) {
        console.log('enter set file to file list : ', files, ' - ', this.file_picker_el)
        if (!this.isFileExist(files)) return
        console.log('isFileExist -- true')

        this.fileList = []
        const videoChatFile = await this.setFIleToFileListForVideo(files)
        if (videoChatFile != undefined) {
            this.fileList.push(videoChatFile)
            this.resizeChatScreen()
            return
        }
        let fileInsertCount = 0
        for (const [key, value] of Object.entries(files)) {
            if (this.commonCommunityService.checkFileLengthExceed(fileInsertCount, 1)) break
            if (this.commonCommunityService.checkFileSizeTooLarge(value)) {
                this.nxStore.dispatch(showToast({ text: `${value.name}의 파일 용량이 300MB를 초과하였습니다.` }))
                continue
            }
            const type = this.commonCommunityService.setLocalFileType(value)
            console.log(' enter file type setting !!!!!!!')
            if (type == 'image') {
                const fileReader = new FileReader()
                fileReader.onload = (e) => {
                    this.fileList.push({
                        file: value,
                        result: e.target.result as string,
                        type: type,
                        mimetype: value.type,
                        videoImageFile: null,
                    })
                    this.resizeChatScreen()

                    console.log('setFileToFileList -- filelist : ', type, '; ', this.fileList, files)
                }
                fileReader.readAsDataURL(value)
            } else {
                const thumbnailFile =
                    type == 'video' ? await this.videoProcessingService.generateThumbnail(value) : null
                this.fileList.push({
                    file: value,
                    result: thumbnailFile != null ? thumbnailFile.url : null,
                    type: type,
                    mimetype: value.type,
                    videoImageFile: thumbnailFile != null ? thumbnailFile.file : null,
                })
                this.resizeChatScreen()
            }
            fileInsertCount++
            console.log('setFileToFileList -- filelist : ', type, '; ', this.fileList, files)
        }
    }

    // setFileToFileList helper

    async setFIleToFileListForVideo(files: FileList): Promise<any | null> {
        const videoFile = _.values(files).find((file) => this.commonCommunityService.setLocalFileType(file) == 'video')
        if (videoFile == undefined) return null
        const thumbnailFile = await this.videoProcessingService.generateThumbnail(videoFile)
        const videoChatFile: ChatFile = {
            file: videoFile,
            result: thumbnailFile.url,
            type: 'video',
            mimetype: videoFile.type,
            videoImageFile: thumbnailFile.file,
        }
        if (files.length > 1) {
            this.nxStore.dispatch(showToast({ text: '영상 파일이 포함된 경우, 하나의 영상만 전송할 수 있습니다.' }))
        }
        return videoChatFile
    }

    //

    isFileExist(fileList: FileList) {
        if (fileList && fileList.length == 0) {
            return false
        }
        return true
    }
    removeFile(idx: number) {
        this.fileList = this.fileList.filter((value, index) => idx != index)
        this.file_picker_el.nativeElement.value = ''
        this.resizeChatScreen()
    }

    // <-----------------------------------

    // functions related to room
    // ! needed to modify
    createChatRoom(selectedMembers: Array<CenterUser>, curCenterUser: CenterUser) {
        const user_ids = selectedMembers.map((v) => v.id)
        user_ids.push(curCenterUser.id)
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

    createTemChatRoom(selectedMembers: Array<CenterUser>, curCenterUser: CenterUser) {
        this.nxStore.dispatch(
            CommunityActions.createTempChatRoom({
                center: this.center,
                members: selectedMembers,
                curUser: curCenterUser,
                spot: 'main',
            })
        )
    }
    // <-----------------------------------

    // modal vars and fucntions

    // - // 채팅방 입장
    public joinRoom(chatRoom: ChatRoom) {
        if (chatRoom.id == this.curChatRoom_.id) return
        this.resetChangeRoomNameData()
        this.resetChatInputData()
        if (_.includes(chatRoom.id, IsTmepRoom)) {
            this.nxStore.dispatch(CommunityActions.joinTempChatRoom({ chatRoom, spot: 'main' }))
        } else {
            this.nxStore.dispatch(
                CommunityActions.startJoinChatRoom({ centerId: this.center.id, chatRoom: chatRoom, spot: 'main' })
            )
        }
    }

    // - // 채팅방 생성
    public doShowCreateRoomModal = false
    showCreateRoomModal() {
        this.doShowCreateRoomModal = true
    }
    hideCreateRoomModal() {
        this.doShowCreateRoomModal = false
    }
    onCreateRoomConfirm(res: InviteConfirm) {
        this.hideCreateRoomModal()
        this.createTemChatRoom(res.members, res.curCenterUser)
        // this.createChatRoom(res.members, res.curCenterUser)
    }

    // - // 채팅방 초대
    public doShowInviteUserModal = false
    showInviteUserModal() {
        this.doShowInviteUserModal = true
    }
    hideInviteUserModal() {
        this.doShowInviteUserModal = false
    }
    onInviteUserConfirm(res: InviteConfirm) {
        this.hideInviteUserModal()
        this.nxStore.dispatch(
            CommunityActions.startInviteMembers({ centerId: this.center.id, invitedMembers: res.members, spot: 'main' })
        )
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
        if (_.includes(this.curChatRoom_.id, IsTmepRoom)) {
            this.nxStore.dispatch(CommunityActions.leaveTempChatRoom({ spot: 'main' }))
            this.nxStore.dispatch(showToast({ text: '채팅방 나가기가 완료되었습니다' }))
            this.nxStore.dispatch(
                CommunityActions.startJoinChatRoom({
                    centerId: this.center.id,
                    chatRoom: this.chatRoomList_.find((v) => v.type_code == 'chat_room_type_chat_with_me'),
                    spot: 'main',
                })
            )
        } else {
            this.nxStore.dispatch(CommunityActions.startLeaveChatRoom({ centerId: this.center.id, spot: 'main' }))
        }
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
    // <---------------------

    //

    // - // chatInput fucntions and validator, chat-message component helper tag vars  //!! 더 추가 필요
    @ViewChild('chatting_screen') chatting_screen: ElementRef
    @ViewChild('chatting_input') chatting_input: ElementRef
    @ViewChildren('message_el') message_el: QueryList<any>
    @ViewChild('chat_textarea') chat_textarea_el: ElementRef
    @ViewChild('file_picker') file_picker_el: ElementRef

    // chat-message component helper
    public isNearBottom = true
    showUser(index): boolean {
        return this.chatRoomMsgs_.length > index + 1 &&
            this.chatRoomMsgs_[index].user_id &&
            this.chatRoomMsgs_[index].user_id == this.chatRoomMsgs_[index + 1].user_id &&
            dayjs(this.chatRoomMsgs_[index].created_at).format('YYYY-MM-DD_HH_mm') ==
                dayjs(this.chatRoomMsgs_[index + 1].created_at).format('YYYY-MM-DD_HH_mm')
            ? // && this.chatRoomMsgs_[index + 1].type_code != 'info'
              false
            : true
    }

    scrolled(event: any): void {
        this.isNearBottom = this.isScrollNearBottom()

        if (this.isScrollNearTop() && !this.chatRoomMsgLoading_) {
            this.nxStore.dispatch(CommunityActions.startGetMoreChatRoomMsgs({ centerId: this.center.id, spot: 'main' }))
        }
    }
    onItemElementsChanged(): void {
        if (this.isNearBottom) {
            this.scrollToBottom()
        }
    }
    scrollToBottom(): void {
        this.chatting_screen.nativeElement.scroll({
            top: this.chatting_screen.nativeElement.scrollHeight,
            left: 0,
            // behavior: 'smooth'
        })
    }

    isScrollNearTop(): boolean {
        const threshold = 10
        const position =
            this.chatting_screen.nativeElement.scrollTop * -1 + this.chatting_screen.nativeElement.offsetHeight
        const height = this.chatting_screen.nativeElement.scrollHeight
        // console.log(`isScrollNearTop -  ${position} , ${height} , ${position + threshold >= height}`)
        return position + threshold >= height
    }

    isScrollNearBottom(): boolean {
        const threshold = 100
        const position =
            this.chatting_screen.nativeElement.scrollTop * -1 + this.chatting_screen.nativeElement.offsetHeight
        const height = this.chatting_screen.nativeElement.offsetHeight
        return position < height + threshold
    }

    // - // chatInput fucntions and validator
    public textareaResizeOption = {
        fontSize: 14,
        maxLine: 10,
        initHeight: 30,
        lineHeight: 1.43,
    }

    // ! 입력란 여백 제조정 필요
    public resizeHeight = 30

    onChatInputResize(resizeHeight: string) {
        // console.log('onChatInputResize : ', resizeHeight)
        this.resizeHeight = Number(resizeHeight.slice(0, -2))
        this.resizeChatScreen()
    }
    resizeChatScreen() {
        if (this.fileList.length > 0) {
            const screenPadMar = 150 + this.resizeHeight // 120px --> padding: 10px * 2 + margin: 30px 15px + fileHeight: 85px
            const inputHeight = 105 + this.resizeHeight // 20px --> padding: 10px * 2 + fileHeight: 85px
            this.renderer.setStyle(this.chatting_screen.nativeElement, 'height', `calc(100% - ${screenPadMar}px)`)
            this.renderer.setStyle(this.chatting_input.nativeElement, 'height', `${inputHeight}px`)
        } else {
            const screenPadMar = 65 + this.resizeHeight // 60px --> padding: 10px * 2 + margin: 30px 15px
            const inputHeight = 20 + this.resizeHeight // 20px --> padding: 10px * 2
            this.renderer.setStyle(this.chatting_screen.nativeElement, 'height', `calc(100% - ${screenPadMar}px)`)
            this.renderer.setStyle(this.chatting_input.nativeElement, 'height', `${inputHeight}px`)
        }
    }
    resetChatScreenSize() {
        this.resizeHeight = 30
        this.renderer.removeStyle(this.chatting_screen.nativeElement, 'height')
        this.renderer.removeStyle(this.chatting_input.nativeElement, 'height')
        // this.renderer.removeStyle(this.chat_textarea_el.nativeElement, 'height')
    }

    onInputKeyPress(e: KeyboardEvent) {
        if (e.key == 'Enter' && !e.shiftKey) {
            // prevent default behavior
            e.preventDefault()
            this.sendMessage(this.chatInput.value)
            return true
        } else {
            return true
        }
    }

    inputValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!_.trim(control.value)) {
                return { emptyString: true }
            }
            return null
        }
    }

    resetChatInputData() {
        this.chatInput.setValue('')
        this.resetChatScreenSize()
        this.fileList = []
        this.file_picker_el.nativeElement.value = ''
    }
    // <---------------------

    // ----------------------------------------- message funcs -----------------------------------------------------

    // ----------------------------------- send message function -------------------------------------->//
    sendMessage(text: string) {
        // !! 분기 필요
        if (this.fileList.length > 0) {
            this.sendMessageWithFile(text)
        } else {
            this.sendTextMessage(text)
        }
        this.resetChatInputData()
    }

    sendTextMessage(text: string) {
        if (_.includes(this.curChatRoom_.id, IsTmepRoom)) {
            const createRoom: CenterChatRoomApi.CreateChatRoomReqBody = {
                type_code: 'chat_room_type_general',
                user_ids: this.curChatRoom_.chat_room_users.map((v) => v.id),
            }
            const sendMsg: CenterChatRoomApi.SendMessageReqBody = {
                type_code: 'chat_room_message_type_text',
                text: text,
                url: '_',
                originalname: '_',
                mimetype: '_',
                size: 0,
            }

            this.nxStore.dispatch(
                CommunityActions.startSendMessageToTempRoom({
                    centerId: this.center.id,
                    reqBody: {
                        createRoom,
                        sendMsg,
                    },
                    spot: 'main',
                })
            )
        } else {
            const reqBody: CenterChatRoomApi.SendMessageReqBody = {
                type_code: 'chat_room_message_type_text',
                text: text,
                url: '_',
                originalname: '_',
                mimetype: '_',
                size: 0,
            }
            this.nxStore.dispatch(
                CommunityActions.startSendMessage({ centerId: this.center.id, reqBody, spot: 'main' })
            )
        }
    }

    sendMessageWithFile(text: string) {
        // !! 썸네일 작업이 필요할 때 여기서 ... 했었음

        if (_.includes(this.curChatRoom_.id, IsTmepRoom)) {
            this.nxStore.dispatch(
                CommunityActions.startSendMessageWithFileToTempRoom({
                    centerId: this.center.id,
                    user: this.user,
                    text,
                    fileList: this.fileList,
                    user_ids: this.curChatRoom_.chat_room_users.map((v) => v.id),
                    spot: 'main',
                })
            )
        } else {
            this.nxStore.dispatch(
                CommunityActions.startSendMessageWithFile({
                    centerId: this.center.id,
                    user: this.user,
                    text,
                    fileList: this.fileList,
                    spot: 'main',
                })
            )
        }
    }
}
