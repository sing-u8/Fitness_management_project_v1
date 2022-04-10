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
    OnInit,
    AfterViewInit,
} from '@angular/core'
import { FormBuilder, FormControl, ValidationErrors, AsyncValidatorFn, AbstractControl } from '@angular/forms'
import { Observable } from 'rxjs'
import { distinctUntilChanged, debounceTime, map, switchMap } from 'rxjs/operators'
import * as _ from 'lodash'

import { CenterUsersService } from '@services/center-users.service'
import { StorageService } from '@services/storage.service'

import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'

@Component({
    selector: 'rw-member-list-modal',
    templateUrl: './member-list-modal.component.html',
    styleUrls: ['./member-list-modal.component.scss'],
})
export class MemberListModalComponent implements AfterViewChecked, OnChanges, AfterViewInit {
    @Input() visible: boolean

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<any>()

    changed: boolean

    public center: Center

    public centerUsers: Array<CenterUser>
    public memberSearchInput: FormControl

    public isMouseModalDown: boolean

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private centerUsersService: CenterUsersService,
        private storageService: StorageService,
        private fb: FormBuilder
    ) {
        this.isMouseModalDown = false
        this.centerUsers = []
        this.memberSearchInput = this.fb.control('', { asyncValidators: [this.searchMemberValidator()] })
    }

    ngAfterViewInit(): void {
        this.center = this.storageService.getCenter()
        this.centerUsersService.getUserList(this.center.id, '', '', '').subscribe((memberList) => {
            this.centerUsers = memberList.reverse()
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
    }

    ngAfterViewChecked() {
        if (this.changed) {
            this.changed = false

            if (this.visible) {
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
            }
        }
    }

    onCancel(): void {
        this.cancel.emit({})
    }

    onConfirm(member: CenterUser): void {
        this.confirm.emit(member)
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }

    searchMemberValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return control.valueChanges.pipe(
                distinctUntilChanged(),
                debounceTime(500),
                switchMap((v) => this.centerUsersService.getUserList(this.center.id, v, '')),
                map((memberList) => {
                    this.centerUsers = memberList.reverse()
                    return null
                })
            )
        }
    }
}
