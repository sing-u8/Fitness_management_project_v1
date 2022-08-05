import {
    Component,
    Input,
    ElementRef,
    Renderer2,
    Output,
    EventEmitter,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    AfterViewChecked,
    ViewChild,
} from '@angular/core'

import _ from 'lodash'

import { ClickEmitterType } from '@shared/components/common/button/button.component'
import { Center } from '@schemas/center'
import { CenterRolePermissionService } from '@services/center-role-permission.service'

import { Subject, takeUntil } from 'rxjs'

import { showRoleModal, closeRoleModal, startCloseRoleModal } from '@appStore/actions/modal.action'
import { RoleModal } from '@schemas/store/app/modal.interface'
import { select, Store } from '@ngrx/store'

@Component({
    selector: 'rw-rolemodal',
    templateUrl: './rolemodal.component.html',
    styleUrls: ['./rolemodal.component.scss'],
})
export class RolemodalComponent implements OnChanges, AfterViewChecked, OnDestroy {
    @Input() visible = false
    @Output() visibleChange = new EventEmitter<boolean>()

    @Input() roleModal: RoleModal = {
        visible: false,
        center: undefined,
        permissionCateg: [],
    }

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    public changed: boolean
    public isMouseModalDown = false

    public unsubscribe$ = new Subject<boolean>()

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private nxStore: Store,
        private centerRolePermissionService: CenterRolePermissionService
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (!changes['visible']?.firstChange) {
            if (changes['visible']?.previousValue != changes['visible']?.currentValue) {
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

    ngOnDestroy(): void {
        this.unsubscribe$.next(true)
        this.unsubscribe$.complete()
    }

    onCancel(): void {
        this.nxStore.dispatch(closeRoleModal())
    }
    onSave(clickEmitter: ClickEmitterType): void {
        // console.log(
        //     'on save : ',
        //     this.roleModal.permissionCateg
        //         .find((v) => v.code == 'stats_sales')
        //         .items.find((v) => v.code == 'read_stats_sales').approved,
        //     this.roleModal.permissionCateg
        // )
        clickEmitter.showLoading()
        this.nxStore.dispatch(
            startCloseRoleModal({
                clickEmitter,
                instPermissionCategs: this.roleModal.permissionCateg,
                center: this.roleModal.center,
            })
        )
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
}
