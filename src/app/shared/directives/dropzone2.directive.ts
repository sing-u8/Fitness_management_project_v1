import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnDestroy, Output, Renderer2 } from '@angular/core'
import * as _ from 'lodash'

@Directive({
    selector: '[rw-dropzone2]',
})
export class Dropzone2Directive implements OnDestroy, AfterViewInit {
    @Input('dropzoneStyle') dropzoneStyle: any // ! 추후에 필요하면 스타일 추가 하는 코드 작성하기
    @Input() dropLeaveTargetId: string

    @Output('onDrop') onDrop = new EventEmitter<FileList>()
    @Output('onDragEnter') onDragEnter = new EventEmitter<any>()
    @Output('onDragLeave') onDragLeave = new EventEmitter<any>()
    @Output('onDragOver') onDragOver = new EventEmitter<any>()

    public dropUnListener: () => void
    public dragEnterUnListener: () => void
    public dragLeaveUnListener: () => void
    public dragOverUnListener: () => void

    constructor(private el: ElementRef, private renderer: Renderer2) {
        // set listener
        this.dropUnListener = this.renderer.listen(this.el.nativeElement, 'drop', (e) => {
            if (_.some(e.path, (el) => el == this.el.nativeElement)) {
                e.preventDefault()
                e.stopPropagation()
                this.onDrop.emit(e.dataTransfer.files)
            } else {
                e.preventDefault()
                e.dataTransfer.effectAllowed = 'none'
                e.dataTransfer.dropEffect = 'none'
            }
        })

        this.dragEnterUnListener = this.renderer.listen(this.el.nativeElement, 'dragenter', (e) => {
            if (_.some(e.path, (el) => el == this.el.nativeElement)) {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'none'
                this.onDragEnter.emit({})
            } else {
                e.preventDefault()
                e.dataTransfer.effectAllowed = 'none'
                e.dataTransfer.dropEffect = 'none'
            }
        })
        this.dragOverUnListener = this.renderer.listen(this.el.nativeElement, 'dragover', (e) => {
            if (_.some(e.path, (el) => el == this.el.nativeElement)) {
                e.preventDefault()
                e.stopPropagation()
                this.onDragOver.emit({})
            } else {
                e.preventDefault()
                e.dataTransfer.effectAllowed = 'none'
                e.dataTransfer.dropEffect = 'none'
            }
        })
    }

    ngAfterViewInit(): void {
        this.dragLeaveUnListener = this.renderer.listen(this.el.nativeElement, 'dragleave', (e) => {
            if (_.some(e.path, (el) => el == this.el.nativeElement)) {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'none'

                if (_.some(e.path, (el) => el.id == this.dropLeaveTargetId)) {
                    this.onDragLeave.emit({})
                }
            }
        })
    }

    ngOnDestroy(): void {
        this.dragEnterUnListener()
        this.dragOverUnListener()
        this.dropUnListener()
        this.dragLeaveUnListener()
    }
}
