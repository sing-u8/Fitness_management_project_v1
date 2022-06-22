import {
    Component,
    OnInit,
    Input,
    AfterContentInit,
    AfterViewInit,
    Renderer2,
    ViewChild,
    ElementRef,
} from '@angular/core'
import { NgxSpinnerService } from 'ngx-spinner'

// const ogs = require('open-graph-scraper')

import { saveAs } from 'file-saver'

import { FileService } from '@services/file.service'
import { VideoProcessingService } from '@services/helper/video-processing-service.service'

import { CenterUser } from '@schemas/center-user'
import { ChatRoomMessage, ChatRoomMessageType, ChatRoomLoadingMessage } from '@schemas/chat-room-message'

@Component({
    selector: 'rw-chat-message',
    templateUrl: './chat-message.component.html',
    styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit, AfterContentInit, AfterViewInit {
    @Input() message: ChatRoomLoadingMessage | ChatRoomMessage
    @Input() showUserInfo: boolean
    @Input() isSidebar: boolean

    @Input() isLoading: boolean
    @Input() gauge: number

    public type: 'text' | 'date' | 'info' | 'image' | 'file' | 'video'
    public showDownloadButton = false

    public isLinkMessage = false

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
        private videoProcessingService: VideoProcessingService
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
        } else {
            const firstFileType = this.message.mimetype.split('/')[0]
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

    onOpenGraphClick() {
        const url = this.message.url
        window.open(url)
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
            console.log(' gauge in message !! ', this.type, ' - ')
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
                    console.log('this.videoImgURL : ', this.videoImgURL)
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
                    console.log('this.videoImgURL : ', this.videoImgURL)
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
        const options = {
            url: this.message.text,
        }
        // ogs(options)
        //     .then((data) => {
        //         console.log('ogs data : ', data)
        //     })
        //     .catch((err) => {
        //         console.log('ogs err: ', err)
        //     })
    }
}
