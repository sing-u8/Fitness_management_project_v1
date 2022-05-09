import {
    Component,
    OnInit,
    OnDestroy,
    SimpleChanges,
    ElementRef,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    Renderer2,
    OnChanges,
    AfterViewChecked,
} from '@angular/core'

import { StorageService } from '@services/storage.service'

// components
import { ClickEmitterType } from '@shared/components/common/button/button.component'

import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { LockerItem } from '@schemas/locker-item'

// ngrx
import { Store } from '@ngrx/store'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import * as DashboardReducers from '@centerStore/reducers/sec.dashboard.reducer'

@Component({
    selector: 'db-modify-locker-fullmodal',
    templateUrl: './modify-locker-fullmodal.component.html',
    styleUrls: ['./modify-locker-fullmodal.component.scss'],
})
export class ModifyLockerFullmodalComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() close = new EventEmitter<any>()
    @Output() modifyLocker = new EventEmitter<any>()

    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    public changed: boolean

    public center: Center

    constructor(
        private renderer: Renderer2,
        // private readonly cmpStore: RegisterMembershipLockerFullmodalStore,
        private storageService: StorageService,
        private nxStore: Store
    ) {}

    ngOnInit(): void {
        this.center = this.storageService.getCenter()
        // this.cmpStore.setState(stateInit)
        // this.cmpStore.getInstructorsEffect(this.center.id)
        // this.cmpStore.getmembershipItemsEffect(this.center.id)
    }
    ngOnDestroy(): void {
        // this.totlaPriceSumSubscriber.unsubscribe()
        // this.isAllMlItemDoneSubscriber.unsubscribe()
    }
    ngOnChanges(changes: SimpleChanges): void {
        console.log('ngOnChanges ;;; ', changes)
        if (changes['visible'] && !changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
    }
    ngAfterViewChecked(): void {
        if (this.changed) {
            this.changed = false

            if (this.visible) {
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)
                // this.cmpStore.getInstructorsEffect(this.center.id)
                // this.cmpStore.getmembershipItemsEffect(this.center.id)
            } else {
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)

                // this.cmpStore.setState(_.cloneDeep(stateInit))
            }
        }
    }
}
