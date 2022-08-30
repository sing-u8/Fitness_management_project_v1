import { Component, OnInit } from '@angular/core'

import { Drawer } from '@schemas/store/app/drawer.interface'
// rxjs
import { Observable } from 'rxjs'
// ngrx
import { Store, select } from '@ngrx/store'
import { drawerSelector } from '@appStore/selectors'
import { closeDrawer } from '@appStore/actions/drawer.action'

@Component({
    selector: 'dr-member',
    templateUrl: './member.component.html',
    styleUrls: ['./member.component.scss'],
})
export class MemberComponent implements OnInit {
    public drawer$: Observable<Drawer>

    constructor(private nxStore: Store) {}

    ngOnInit(): void {
        this.drawer$ = this.nxStore.pipe(select(drawerSelector))
    }

    closeDrawer() {
        this.nxStore.dispatch(closeDrawer())
    }

    // register modal vars
    public doShowRegisterMemberModal = false
    toggleRegisterMemberModal() {
        this.doShowRegisterMemberModal = !this.doShowRegisterMemberModal
    }
    closeRegisterMemberModal() {
        this.doShowRegisterMemberModal = false
    }

    public doShowDirectRegisterMemberFullModal = false
    toggleDirectRegisterMemberFullModal() {
        this.doShowDirectRegisterMemberFullModal = !this.doShowDirectRegisterMemberFullModal
    }
    whenFinishRegisterMember() {
        this.toggleDirectRegisterMemberFullModal()
        this.toggleRegisterMemberModal()
    }
    closeDirectRegisterMemberFullModal() {
        this.toggleDirectRegisterMemberFullModal()
        this.toggleRegisterMemberModal()
    }
}
