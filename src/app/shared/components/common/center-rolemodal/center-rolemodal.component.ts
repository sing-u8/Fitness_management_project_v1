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

import { ClickEmitterType } from '@schemas/components/button'
import { Center } from '@schemas/center'
import { StorageService } from '@services/storage.service'
import { CenterRolePermissionService } from '@services/center-role-permission.service'

import { setCenterPermissionModal, startUpdateCenterPermission } from '@centerStore/actions/center.common.actions'
import { PermissionObj } from '@centerStore/reducers/center.common.reducer'
import { RoleModal } from '@schemas/store/app/modal.interface'
import { Store } from '@ngrx/store'

@Component({
    selector: 'rw-center-rolemodal',
    templateUrl: './center-rolemodal.component.html',
    styleUrls: ['./center-rolemodal.component.scss'],
})
export class CenterRolemodalComponent implements OnChanges, AfterViewChecked, OnDestroy {
    @Input() visible = false
    @Output() visibleChange = new EventEmitter<boolean>()

    @Input() permissionObj: PermissionObj = {
        visible: false,
        instructor: [],
    }

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    public changed: boolean
    public isMouseModalDown = false
    public center: Center

    constructor(private renderer: Renderer2, private nxStore: Store, private storageService: StorageService) {}

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
                this.center = this.storageService.getCenter()
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

    ngOnDestroy(): void {}

    onCancel(): void {
        this.nxStore.dispatch(setCenterPermissionModal({ visible: false }))
    }
    onSave(clickEmitter: ClickEmitterType): void {
        clickEmitter.showLoading()
        this.nxStore.dispatch(
            startUpdateCenterPermission({
                centerId: this.center.id,
                roleCode: 'instructor',
                permmissionKeyCode: 'stats_sales',
                permissionCode: 'read_stats_sales',
                permissionCategoryList: this.permissionObj.instructor,
                cb: () => {
                    clickEmitter.hideLoading()
                    this.onCancel()
                },
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
