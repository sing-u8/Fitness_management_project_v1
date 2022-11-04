import {
    Component,
    Input,
    ElementRef,
    Renderer2,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    AfterViewChecked,
    ViewChild,
} from '@angular/core'

import { InputHelperService } from '@services/helper/input-helper.service'
import { CenterUsersService, UpdateUserRequestBody } from '@services/center-users.service'
import { StorageService } from '@services/storage.service'

import { Center } from '@schemas/center'
import { CenterUser } from '@schemas/center-user'

@Component({
    selector: 'db-change-user-email-modal',
    templateUrl: './change-user-email-modal.component.html',
    styleUrls: ['./change-user-email-modal.component.scss'],
})
export class ChangeUserEmailModalComponent {
    @Input() visible: boolean
    @Input() curUser: CenterUser

    @ViewChild('modalBackgroundElement') modalBackgroundElement: ElementRef
    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    @ViewChild('inputContainer') inputContainer: ElementRef

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<{ centerId: string; userId: string; reqBody: UpdateUserRequestBody }>()

    public changed: boolean
    public center: Center
    public isError: boolean

    public isMouseModalDown: boolean

    public userEmail = ''

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private inputHelperService: InputHelperService,
        private centerUsersApi: CenterUsersService,
        private storageService: StorageService
    ) {
        this.isMouseModalDown = false
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && !changes['visible']?.firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
                if (changes['visible'].currentValue == true) this.setInputfocus()
            }
        }
    }

    ngAfterViewChecked() {
        if (this.changed) {
            this.changed = false

            if (this.visible) {
                this.center = this.storageService.getCenter()
                this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'display-block')
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)

                this.userEmail = ''
                this.isError = false
            }
        }
    }

    // input autofocus
    setInputfocus() {
        setTimeout(() => {
            this.inputContainer.nativeElement.childNodes[1].focus()
        }, 0)
    }

    // main method

    //

    onCancel(): void {
        this.resetMouseModalDown()
        this.cancel.emit({})
    }

    onConfirm(): void {
        this.isError = false
        this.centerUsersApi
            .updateUser(this.center.id, this.curUser.id, {
                email: this.userEmail,
            })
            .subscribe({
                next: () => {
                    this.confirm.emit({
                        centerId: this.center.id,
                        userId: this.curUser.id,
                        reqBody: {
                            email: this.userEmail,
                        },
                    })
                },
                error: (err) => {
                    this.isError = true
                },
            })
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
}
