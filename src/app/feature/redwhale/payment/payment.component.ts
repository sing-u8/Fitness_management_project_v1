import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Location } from '@angular/common'

// components
import { ClickEmitterType } from '@schemas/components/button'

// ngrx
import { Store } from '@ngrx/store'
import { Loading } from '@schemas/store/loading'
import * as CenterCommonSelector from '@centerStore/selectors/center.common.selector'
import { StorageService } from '@services/storage.service'
import { Subject } from 'rxjs'

type Progress = 'one' | 'two'

import { Center } from '@schemas/center'

@Component({
    selector: 'rw-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, OnDestroy {
    // routing vars
    public curCenter: Center
    //
    public progress: Progress = 'one'
    setProgress(progress: Progress) {
        this.progress = progress
    }

    public unSubscribe$ = new Subject<boolean>()

    constructor(
        private renderer: Renderer2,
        private storageService: StorageService,
        private nxStore: Store,
        private router: Router,
        private location: Location,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        //
        this.curCenter = this.storageService.getCenter()
    }
    ngOnDestroy() {}
}
