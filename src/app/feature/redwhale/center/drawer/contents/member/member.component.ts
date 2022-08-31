import { Component, OnInit } from '@angular/core'

import { Drawer } from '@schemas/store/app/drawer.interface'
import { OutputType } from '@schemas/components/direct-register-member-fullmodal'
// rxjs
import { Observable } from 'rxjs'
// ngrx
import { Store, select } from '@ngrx/store'
import { drawerSelector } from '@appStore/selectors'
import { closeDrawer } from '@appStore/actions/drawer.action'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import * as CenterCommonActions from '@centerStore/actions/center.common.actions'

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
    whenFinishRegisterMember(value: OutputType) {
        // this.nxStore.dispatch(
        //   DashboardActions.startDirectRegisterMember({
        //       centerId: this.center.id,
        //       reqBody: value.reqBody,
        //       imageFile: value.file,
        //       callback: () => {
        //           this.nxStore.dispatch(CenterCommonActions.startGetMembers({ centerId: this.center.id }))
        //           this.nxStore.dispatch(DashboardActions.startGetUsersByCategory({ centerId: this.center.id }))
        //           value.cb ? value.cb() : null
        //           this.toggleDirectRegisterMemberFullModal()
        //           this.toggleRegisterMemberModal()
        //       },
        //   })
        // )
        this.toggleDirectRegisterMemberFullModal()
        this.toggleRegisterMemberModal()
    }
    closeDirectRegisterMemberFullModal() {
        this.toggleDirectRegisterMemberFullModal()
        this.toggleRegisterMemberModal()
    }
}
