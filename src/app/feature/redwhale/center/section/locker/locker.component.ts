import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { FormBuilder, FormControl } from '@angular/forms'
import { CompactType, GridsterConfig, GridType } from 'angular-gridster2'

import _ from 'lodash'

// services
import { StorageService } from '@services/storage.service'
import { CenterLockerService } from '@services/center-locker.service'
import { UsersLockerService } from '@services/users-locker.service'
import { CenterUsersLockerService } from '@services/center-users-locker.service.service'

// schemas
import { LockerCategory } from '@schemas/locker-category'
import { LockerItem } from '@schemas/locker-item'
import { Center } from '@schemas/center'
import { Drawer } from '@schemas/store/app/drawer.interface'

// rxjs
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

// ngrx
import { Store, select } from '@ngrx/store'
import { drawerSelector } from '@appStore/selectors'
import { showToast } from '@appStore/actions/toast.action'

import * as FromLocker from '@centerStore/reducers/sec.locker.reducer'
import * as LockerSelector from '@centerStore/selectors/sec.locker.selector'
import * as LockerActions from '@centerStore/actions/sec.locker.actions'

@Component({
    selector: 'locker',
    templateUrl: './locker.component.html',
    styleUrls: ['./locker.component.scss'],
})
export class LockerComponent implements OnInit, AfterViewInit, OnDestroy {
    // ngrx state
    public lockerCategEntites$ = this.nxStore.pipe(select(LockerSelector.LockerCategEntities))
    public curLockerCateg$ = this.nxStore.pipe(select(LockerSelector.curLockerCateg))
    public curLockerItem$ = this.nxStore.pipe(select(LockerSelector.curLockerItem))
    public willBeMovedLockerItem$ = this.nxStore.pipe(select(LockerSelector.willBeMovedLockerItem))
    public isLoading$ = this.nxStore.pipe(select(LockerSelector.isLoading))
    public curLockerItemList: Array<LockerItem> = []
    public LockerGlobalMode: FromLocker.LockerGlobalMode = 'normal'

    // component vars
    public center: Center = undefined
    public isEditMode = false

    // vars related to willBeMovedLocker
    // public willBeMovedLocker: LockerItem
    // public doShowMoveLockerTicketModal: boolean
    // public moveLockerTicketData: any

    // gridster vars
    public gridsterOptions: GridsterConfig
    public helpTexts = helpTexts

    // block delete categ vars
    public doShowBlockDelCategory: boolean
    public blockDelCategTexts = {
        text: '앗! 등록된 회원이 있어요.😮',
        subText: `카테고리 내 락커를 모두 비우신 후,
        다시 카테고리를 삭제해주세요.`,
        confirmButtonText: '확인',
    }

    public unSubscriber$ = new Subject<void>()

    constructor(private nxStore: Store, private storageService: StorageService, private fb: FormBuilder) {
        this.center = this.storageService.getCenter()
        this.nxStore
            .pipe(select(LockerSelector.curCenterId), takeUntil(this.unSubscriber$))
            .subscribe((curCenterId) => {
                console.log('LockerSelector.curCenterId select : ', curCenterId, ',,,', this.center.id)
                if (curCenterId != this.center.id) {
                    this.nxStore.dispatch(LockerActions.resetAll())
                    this.nxStore.dispatch(LockerActions.startLoadLockerCategs({ centerId: this.center.id }))
                }
            })

        this.nxStore.dispatch(LockerActions.setCurCenterId({ centerId: this.center.id }))
        this.nxStore
            .pipe(select(LockerSelector.curLockerItemList), takeUntil(this.unSubscriber$))
            .subscribe((curLockerItemList) => {
                this.curLockerItemList = curLockerItemList
            })
        this.nxStore.pipe(select(LockerSelector.LockerGlobalMode), takeUntil(this.unSubscriber$)).subscribe((lgm) => {
            this.LockerGlobalMode = lgm
        })
    }

    ngOnInit(): void {}
    ngAfterViewInit(): void {}
    ngOnDestroy(): void {
        this.unSubscriber$.next()
        this.unSubscriber$.complete()
    }

    // <- gridster methods   //
    initGridster() {
        this.gridsterOptions = {
            gridType: GridType.Fixed,
            compactType: CompactType.None,
            mobileBreakpoint: 450,
            displayGrid: 'onDrag&Resize',
            fixedColWidth: 65,
            fixedRowHeight: 65,
            pushItems: false,
            draggable: {
                enabled: false,
            },
            resizable: {
                enabled: false,
            },
            itemChangeCallback: (item, itemComponent) => {
                // console.log('changed item: ', item)
                // if (item.id) {
                //     this.updateGridItem(item)
                // } else {
                //     this.createGridItem(item)
                // }
            },
        }

        // this.itemList = []
    }

    onEditModeChange(e: boolean) {}
    //  gridster methods --> //
}

const helpTexts = [
    {
        title: '변경모드가 무엇인가요?',
        text: '카테고리 내 락커는 최대 100개까지 생성하실 수 있으며, 락커 카테고리는 필요하신 만큼 추가하실 수 있어요.',
    },
    {
        title: '락커 배치는 어떻게 하나요?',
        text: '카테고리 내 락커는 최대 100개까지 생성하실 수 있으며, 락커 카테고리는 필요하신 만큼 추가하실 수 있어요.',
    },
    {
        title: '몇 개까지 만들 수 있나요?',
        text: '카테고리 내 락커는 최대 100개까지 생성하실 수 있으며, 락커 카테고리는 필요하신 만큼 추가하실 수 있어요.',
    },
]
