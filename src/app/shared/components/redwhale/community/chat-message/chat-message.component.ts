import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnInit,
    Renderer2,
    ViewChild,
} from '@angular/core'
import { NgxSpinnerService } from 'ngx-spinner'

import _ from 'lodash'

import { saveAs } from 'file-saver'
import { OpengraphOutput, SystemService } from '@services/system.service'
import { FileService } from '@services/file.service'

import { VideoProcessingService } from '@services/helper/video-processing-service.service'

import { ChatRoomLoadingMessage, ChatRoomMessage } from '@schemas/chat-room-message'

@Component({
    selector: 'rw-chat-message',
    templateUrl: './chat-message.component.html',
    styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit, AfterContentInit, AfterViewInit {
    @Input() message: ChatRoomLoadingMessage | ChatRoomMessage
    @Input() showUserInfo: boolean
    @Input() lastSuccessiveMsg: boolean
    @Input() isSidebar: boolean

    @Input() isLoading: boolean
    @Input() gauge: number

    public type: 'text' | 'date' | 'info' | 'image' | 'file' | 'video'
    public showDownloadButton = false

    public isLinkMessage = false
    public linkMessage: OpengraphOutput = undefined

    public spName = 'sp'
    public gaugeSize = 50

    @ViewChild('image_item_container') image_item_container_EL: ElementRef

    @ViewChild('video_item_container') video_item_container_EL: ElementRef
    public videoImgURL: Array<string> = []
    public fileLoaded: boolean

    constructor(
        private renderer: Renderer2,
        private fileService: FileService,
        private SpinnerService: NgxSpinnerService,
        private videoProcessingService: VideoProcessingService,
        private systemService: SystemService
    ) {}

    ngOnInit(): void {
        this.fileLoaded = false
    }
    ngAfterViewInit(): void {
        this.isLinkMessage = false
        if ('gauge' in this.message) {
            this.spName = this.message.gauge.id
        } else {
            this.spName = this.message.id
        }
        // this.message.type != 'date' && this.message.type != 'info' && this.message.link.opengraphList.length > 0
        //     ? true
        //     : false
    }
    ngAfterContentInit(): void {
        if (this.message.type_code == 'chat_room_message_type_text') {
            this.type = 'text'
        } else if (this.message.type_code == 'chat_room_message_type_system') {
            this.type = 'info'
        } else if (this.message.type_code == 'fe_chat_room_message_type_date') {
            this.type = 'date'
        } else {
            console.log('chat message comp : ', this.message)
            const type = this.message.contentType ?? this.message.mimetype
            const firstFileType = type.split('/')[0]
            this.type = firstFileType.includes('application')
                ? 'file'
                : firstFileType.includes('image')
                ? 'image'
                : firstFileType.includes('video')
                ? 'video'
                : 'text'
        }

        if (this.type == 'video') {
            this.videoProcessingService.generateThumbnailFromVideoUrl(this.message.url).then(({ imgUrl }) => {
                this.videoImgURL = [imgUrl]
            })
        }

        this.checkMsgIsOpenGraph()
        this.initMessageFileStyle()
    }

    onFileClick(url: string) {
        window.open(url)
    }

    async onDownloadFile(file: ChatRoomMessage) {
        const fileBlob = await this.fileService.getUploadedFile(file.url)
        saveAs(fileBlob, file.originalname)
    }

    // ---------------------------------------- file style ---------------------------------------  //
    async initMessageFileStyle() {
        if ('gauge' in this.message) {
            switch (this.type) {
                case 'image':
                    this.setGridStyle(this.image_item_container_EL, 1)
                    break
                case 'video':
                    this.SpinnerService.show(this.spName, {
                        bdColor: 'rgba(96, 96, 96, 0.45',
                        fullScreen: false,
                        type: 'ball-spin',
                        size: 'default',
                    })
                    this.setGridStyle(this.video_item_container_EL, 1)
                    this.videoImgURL = [this.message.url] // file.map((file) => file.thumbnail)
                    if (this.isLoading) return
                    this.fileLoaded = true
                    this.SpinnerService.hide(this.spName)
                    break
            }
        } else {
            switch (this.type) {
                case 'image':
                    this.setGridStyle(this.image_item_container_EL, 1)
                    break
                case 'video':
                    this.setGridStyle(this.video_item_container_EL, 1)
                    // this.videoImgURL = [this.message.url] // file.map((file) => file.thumbnail)
                    if (this.isLoading) return
                    this.fileLoaded = true
                    break
            }
        }
    }

    setGridStyle(el: ElementRef, fileSize: number) {
        if (fileSize > 1 && !this.isSidebar) {
            this.renderer.setStyle(el.nativeElement, 'gridTemplateColumns', `repeat(${fileSize}, 160px)`)
        } else if (fileSize > 1 && this.isSidebar) {
            this.renderer.setStyle(el.nativeElement, 'gridTemplateColumns', `repeat(1, 210px)`)
            this.renderer.setStyle(el.nativeElement, 'gap', `10px`)
            this.renderer.setStyle(el.nativeElement, 'display', `grid`)
        }
    }

    // ----------------------------------- open grahp funcs and vars --------------------------------------
    public isOgs = false
    checkMsgIsOpenGraph() {
        this.systemService.getOpengraphList(this.message.text).subscribe((msg) => {
            if (msg != false) {
                this.isLinkMessage = true
                this.linkMessage = _.isEmpty(msg[0])
                    ? {
                          title: this.systemService.getOpenGraphUrl(this.message.text),
                          description: '여기를 눌러 링크를 확인하세요',
                          url: this.systemService.getOpenGraphUrl(this.message.text),
                          image: undefined,
                      }
                    : {
                          title: msg[0].title ?? this.systemService.getOpenGraphUrl(this.message.text),
                          description: msg[0].description ?? '여기를 눌러 링크를 확인하세요',
                          url: this.systemService.getOpenGraphUrl(this.message.text),
                          image: msg[0].image ?? undefined,
                      }
            }
        })
    }
    onOpenGraphClick() {
        const url = this.linkMessage.url
        window.open(url)
    }
}
