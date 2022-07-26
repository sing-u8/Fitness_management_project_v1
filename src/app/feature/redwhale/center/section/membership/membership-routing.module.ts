import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { MembershipComponent } from './membership.component'

// import { ReserveScheduleComponent } from './section/reserve-schedule/reserve-schedule.component'

const routes: Routes = [
    {
        path: '',
        component: MembershipComponent,
        children: [],
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MembershipRoutingModule {}
