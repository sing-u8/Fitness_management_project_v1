import { Directive, ElementRef, Renderer2, Input, Output, OnDestroy, EventEmitter, HostListener } from '@angular/core'
import * as _ from 'lodash'

@Directive({
    selector: '[rw-dropzone2]',
})
export class Dropzone2Directive implements OnDestroy {
    @Input('dropzoneStyle') dropzoneStyle: any // ! 추후에 필요하면 스타일 추가 하는 코드 작성하기

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
            console.log('drop event: ', e, e.path, this.el.nativeElement)
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

        this.dragEnterUnListener = this.renderer.listen('window', 'dragenter', (e) => {
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
        this.dragLeaveUnListener = this.renderer.listen('window', 'dragleave', (e) => {
            if (_.some(e.path, (el) => el == this.el.nativeElement)) {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'none'
            } else {
                e.preventDefault()
                e.dataTransfer.effectAllowed = 'none'
                e.dataTransfer.dropEffect = 'none'
                this.onDragLeave.emit({})
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

    ngOnDestroy(): void {
        this.dragEnterUnListener()
        this.dragOverUnListener()
        this.dropUnListener()
        this.dragLeaveUnListener()
    }
}
