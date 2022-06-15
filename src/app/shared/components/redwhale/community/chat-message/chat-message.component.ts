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

import { saveAs } from 'file-saver'

import { FileService } from '@services/file.service'

import { CenterUser } from '@schemas/center-user'
import { ChatRoomMessage, ChatRoomMessageType } from '@schemas/chat-room-message'

@Component({
    selector: 'rw-chat-message',
    templateUrl: './chat-message.component.html',
    styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit, AfterContentInit, AfterViewInit {
    @Input() message: ChatRoomMessage
    @Input() showUserInfo: boolean
    @Input() isSidebar: boolean

    @Input() isLoading: boolean
    @Input() gauge: number

    public type: ChatRoomMessageType | 'date' | 'info' | 'image' | 'file' | 'video' // !! 이후에 날짜 문구 표시는 어떻게 해야할 지 고려하기
    public showDownloadButton = false

    public isLinkMessage = false

    public spName = 'sp'

    @ViewChild('image_item_container') image_item_container_EL: ElementRef

    @ViewChild('video_item_container') video_item_container_EL: ElementRef
    public videoImgURL: Array<string> = []
    public fileLoaded: boolean

    constructor(
        private renderer: Renderer2,
        private fileService: FileService,
        private SpinnerService: NgxSpinnerService
    ) {}

    ngOnInit(): void {
        this.fileLoaded = false
    }
    ngAfterViewInit(): void {
        this.isLinkMessage = false
        // this.message.type != 'date' && this.message.type != 'info' && this.message.link.opengraphList.length > 0
        //     ? true
        //     : false
        this.initMessageFileStyle()
    }
    ngAfterContentInit(): void {
        this.type = this.message.type_code
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
        // switch (this.message.type_code) {
        //     case 'image':
        //         this.setGridStyle(this.image_item_container_EL, this.message.file.length)
        //         break
        //     case 'video':
        //         this.SpinnerService.show(this.spName, {
        //             bdColor: 'rgba(96, 96, 96, 0.45',
        //             fullScreen: false,
        //             type: 'ball-spin',
        //             size: 'default',
        //         })
        //         this.setGridStyle(this.video_item_container_EL, this.message.file.length)
        //         this.videoImgURL = this.message.file.map((file) => file.thumbnail)
        //         if (this.isLoading) return
        //         this.fileLoaded = true
        //         this.SpinnerService.hide(this.spName)
        //         console.log('this.videoImgURL : ', this.videoImgURL)
        //         break
        // }
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
}
