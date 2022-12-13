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

@Component({
    selector: 'db-change-user-birth-date-modal',
    templateUrl: './change-user-birth-date-modal.component.html',
    styleUrls: ['./change-user-birth-date-modal.component.scss'],
})
export class ChangeUserBirthDateModalComponent implements OnChanges, AfterViewChecked {
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

    public userBirthDate: FormControl

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private inputHelperService: InputHelperService,
        private centerUsersApi: CenterUsersService,
        private storageService: StorageService
    ) {
        this.isMouseModalDown = false

        this.userBirthDate = new FormControl('', [
            Validators.required,
            Validators.pattern('^[0-9]{4}[.](0[1-9]|1[012])[.](0[1-9]|[12][0-9]|3[01])$'),
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

                this.userBirthDate.reset()
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
                birth_date: this.userBirthDate.value,
            })
            .subscribe({
                next: () => {
                    this.confirm.emit({
                        centerId: this.center.id,
                        userId: this.curUser.id,
                        reqBody: {
                            birth_date: this.userBirthDate.value,
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

    matchBirthdateForm(event) {
        const userDataSize = this.userBirthDate.value.length
        const userData = this.userBirthDate.value
        const lastStr = this.userBirthDate.value[userDataSize - 1]
        const digitReg = /[\d]/g
        const dotReg = /[.]/g

        const code = event.which ? event.which : event.keyCode

        if (userDataSize == 5 && code != 8) {
            if (digitReg.test(lastStr)) {
                this.userBirthDate.patchValue(userData.slice(0, 4) + '.' + userData.slice(4))
            } else if (dotReg.test(lastStr)) {
                this.userBirthDate.patchValue(userData.slice(0, 4))
            }
        } else if (userDataSize == 8 && code != 8) {
            if (digitReg.test(lastStr)) {
                this.userBirthDate.patchValue(userData.slice(0, 7) + '.' + userData.slice(7))
            } else if (dotReg.test(lastStr)) {
                this.userBirthDate.patchValue(userData.slice(0, 7))
            }
        }
    }

    onlyNumberCheck(event) {
        if (this.inputHelperService.restrictToNumber(event)) {
            this.matchBirthdateForm(event)
            return true
        }
        return false
    }
}
