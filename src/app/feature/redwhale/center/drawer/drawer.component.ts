import { Component, OnInit } from '@angular/core'

import { Drawer } from '@schemas/store/app/drawer.interface'
// rxjs
import { Observable } from 'rxjs'
// ngrx
import { Store, select } from '@ngrx/store'
import { drawerSelector } from '@appStore/selectors'

@Component({
    selector: 'drawer',
    templateUrl: './drawer.component.html',
    styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements OnInit {
    public drawer$: Observable<Drawer>

    constructor(private nxStore: Store) {}

    ngOnInit(): void {
        this.drawer$ = this.nxStore.pipe(select(drawerSelector))
    }
}
