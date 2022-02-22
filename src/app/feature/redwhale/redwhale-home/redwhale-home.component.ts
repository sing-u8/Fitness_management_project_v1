import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { StorageService } from '@services/storage.service'

// ngrx
import { Store } from '@ngrx/store'
import { removeRegistration } from '@appStore/actions/registration.action'

@Component({
    selector: 'redwhale-home',
    templateUrl: './redwhale-home.component.html',
    styleUrls: ['./redwhale-home.component.scss'],
})
export class RedwhaleHomeComponent implements OnInit {
    constructor(private router: Router, private storageService: StorageService, private nxStore: Store) {}

    ngOnInit(): void {
        this.nxStore.dispatch(removeRegistration())
        this.storageService.removeCenter()
    }
}
