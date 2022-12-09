import {
    Component,
    Input,
    ElementRef,
    Renderer2,
    Output,
    EventEmitter,
    SimpleChanges,
    ViewChild,
    OnChanges,
    AfterViewChecked,
} from '@angular/core'

import { InputHelperService } from '@services/helper/input-helper.service'
import { CenterUsersService, UpdateUserRequestBody } from '@services/center-users.service'
import { StorageService } from '@services/storage.service'

import { Center } from '@schemas/center'
import { CenterUser } from '@schemas/center-user'
import { FormControl, Validators } from '@angular/forms'
import _ from 'lodash'

@Component({
    selector: 'db-change-user-phone-number-modal',
    templateUrl: './change-user-phone-number-modal.component.html',
    styleUrls: ['./change-user-phone-number-modal.component.scss'],
})
export class ChangeUserPhoneNumberModalComponent implements OnChanges, AfterViewChecked {
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

    public userPhoneNumber: FormControl

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private inputHelperService: InputHelperService,
        private centerUsersApi: CenterUsersService,
        private storageService: StorageService
    ) {
        this.isMouseModalDown = false

        this.userPhoneNumber = new FormControl('', [
            Validators.required,
            Validators.pattern(`\\(?([0-9]{3})\\)?([ .-]?)([0-9]{4})\\2([0-9]{4})`),
            Validators.maxLength(13),
        ])
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

                this.userPhoneNumber.reset()
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
                phone_number: _.camelCase(this.userPhoneNumber.value),
            })
            .subscribe({
                next: () => {
                    this.confirm.emit({
                        centerId: this.center.id,
                        userId: this.curUser.id,
                        reqBody: {
                            phone_number: _.camelCase(this.userPhoneNumber.value),
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

    matchPhoneNumberForm(event) {
        const userDataSize = this.userPhoneNumber.value.length
        const userData = this.userPhoneNumber.value
        const lastStr = this.userPhoneNumber.value[userDataSize - 1]
        const digitReg = /\d/g
        const dashReg = /-/g
        
        const code = event.which ? event.which : event.keyCode

        if (userDataSize == 4 && code != 8) {
            if (digitReg.test(lastStr)) {
                
                this.userPhoneNumber.patchValue(userData.slice(0, 3) + '-' + userData.slice(3))
            } else if (dashReg.test(lastStr)) {
                this.userPhoneNumber.patchValue(userData.slice(0, 3))
            }
        } else if (userDataSize == 9 && code != 8) {
            if (digitReg.test(lastStr)) {
                this.userPhoneNumber.patchValue(userData.slice(0, 8) + '-' + userData.slice(8))
            } else if (dashReg.test(lastStr)) {
                this.userPhoneNumber.patchValue(userData.slice(0, 8))
            }
        }
    }

    onlyNumberCheck(event) {
        if (this.inputHelperService.restrictToNumber(event)) {
            this.matchPhoneNumberForm(event)
            return true
        }
        return false
    }
}
