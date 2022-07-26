import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { LockerComponent } from './locker.component'

// import { ReserveScheduleComponent } from './section/reserve-schedule/reserve-schedule.component'

const routes: Routes = [
    {
        path: '',
        component: LockerComponent,
        children: [],
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LockerRoutingModule {}
