import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { ScheduleComponent } from './schedule.component'

// import { ReserveScheduleComponent } from './section/reserve-schedule/reserve-schedule.component'

const routes: Routes = [
    {
        path: '',
        component: ScheduleComponent,
        children: [],
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ScheduleRoutingModule {}
