import { Component, OnInit } from '@angular/core'

import { Drawer } from '@schemas/store/app/drawer.interface'
// rxjs
import { Observable } from 'rxjs'

// ngrx
import { Store, select } from '@ngrx/store'
import { drawerSelector } from '@appStore/selectors'

@Component({
    selector: 'center',
    templateUrl: './center.component.html',
    styleUrls: ['./center.component.scss'],
})
export class CenterComponent implements OnInit {
    public drawer$: Observable<Drawer>

    constructor(private nxStore: Store) {}

    ngOnInit(): void {
        this.drawer$ = this.nxStore.pipe(select(drawerSelector))
    }
}
