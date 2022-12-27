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
    OnDestroy,
    AfterViewInit,
} from '@angular/core'
import { FormBuilder, FormControl, ValidationErrors, AsyncValidatorFn, AbstractControl } from '@angular/forms'
import { Observable } from 'rxjs'
import { distinctUntilChanged, debounceTime, map, switchMap, takeUntil } from 'rxjs/operators'
import _ from 'lodash'

import { CenterUsersService } from '@services/center-users.service'
import { StorageService } from '@services/storage.service'

import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'

// rxjs
import { Subject } from 'rxjs'

// ngrx
import { Store, select } from '@ngrx/store'
import * as CenterCommonSelector from '@centerStore/selectors/center.common.selector'

@Component({
    selector: 'rw-register-locker-modal',
    templateUrl: './register-locker-modal.component.html',
    styleUrls: ['./register-locker-modal.component.scss'],
})
export class RegisterLockerModalComponent implements AfterViewChecked, OnChanges, AfterViewInit, OnDestroy {
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

    public unsubscrib$ = new Subject<boolean>()

    constructor(
        private el: ElementRef,
        private nxStore: Store,
        private renderer: Renderer2,
        private centerUsersService: CenterUsersService,
        private storageService: StorageService,
        private fb: FormBuilder
    ) {
        this.isMouseModalDown = false
        this.centerUsers = []
        this.memberSearchInput = this.fb.control('', { asyncValidators: [this.searchMemberValidator()] })
        this.center = this.storageService.getCenter()

        this.nxStore.pipe(select(CenterCommonSelector.members), takeUntil(this.unsubscrib$)).subscribe((members) => {
            const membersClone = _.cloneDeep(members)
            this.centerUsers = membersClone.reverse()
        })
    }

    ngAfterViewInit(): void {}

    ngOnChanges(changes: SimpleChanges) {
        if (!changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
    }

    ngOnDestroy(): void {
        this.unsubscrib$.next(true)
        this.unsubscrib$.complete()
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
                this.memberSearchInput.setValue('')
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
                switchMap((v) =>
                    this.nxStore.select(CenterCommonSelector.members).pipe(
                        map((members) =>
                            _.filter(members, (member) => {
                                const input = _.trim(v)
                                return _.includes(member.name, input) || _.includes(member.phone_number, input)
                            })
                        )
                    )
                ),
                map((memberList) => {
                    this.centerUsers = memberList.reverse()
                    return null
                })
            )
        }
    }
}
