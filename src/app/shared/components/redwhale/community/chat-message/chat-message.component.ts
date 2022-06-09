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

import { MsgType, Message, File as _File } from '@schemas/firestore/message'
import { CenterUser } from '@schemas/center-user'

@Component({
    selector: 'rw-chat-message',
    templateUrl: './chat-message.component.html',
    styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit, AfterContentInit, AfterViewInit {
    @Input() message: Message
    @Input() showUserInfo: boolean
    @Input() isSidebar: boolean

    @Input() isLoading: boolean
    @Input() gauge: number

    @Input() currentUser: CenterUser

    public type: MsgType | 'date'
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
        this.isLinkMessage =
            this.message.type != 'date' && this.message.type != 'info' && this.message.link.opengraphList.length > 0
                ? true
                : false
        if (this.isLinkMessage)
            console.log('isLinkMessage: ', this.isLinkMessage, this.message.link.opengraphList[0]?.url)
        this.initMessageFileStyle()
    }
    ngAfterContentInit(): void {
        this.type = this.message.type
    }

    onOpenGraphClick() {
        const url = this.message.link.opengraphList[0].url
        window.open(url)
    }
    onFileClick(url: string) {
        window.open(url)
    }

    async onDownloadFile(file: _File) {
        const fileBlob = await this.fileService.getUploadedFile(file.url)
        saveAs(fileBlob, file.originFileName)
    }

    // ---------------------------------------- file style ---------------------------------------  //
    async initMessageFileStyle() {
        this.message.file
        switch (this.message.type) {
            case 'image':
                this.setGridStyle(this.image_item_container_EL, this.message.file.length)
                break
            case 'video':
                this.SpinnerService.show(this.spName, {
                    bdColor: 'rgba(96, 96, 96, 0.45',
                    fullScreen: false,
                    type: 'ball-spin',
                    size: 'default',
                })
                this.setGridStyle(this.video_item_container_EL, this.message.file.length)

                // Promise.all(
                //     this.message.file.map(async (file) => {
                //         const uplodedFile = await this.fileService.getUploadedFile(file.url)
                //         const thumbnailFile = await this.videoProcessingService.generateThumbnail(uplodedFile)
                //         return thumbnailFile.url
                //     })
                // ).then((value) => {
                //     this.videoImgURL = value
                //     this.fileLoaded = true
                //
                // })
                this.videoImgURL = this.message.file.map((file) => file.thumbnail)
                if (this.isLoading) return
                this.fileLoaded = true
                this.SpinnerService.hide(this.spName)
                console.log('this.videoImgURL : ', this.videoImgURL)
                break
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
}
