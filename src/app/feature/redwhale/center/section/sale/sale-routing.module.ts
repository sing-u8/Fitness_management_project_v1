import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { SaleComponent } from './sale.component'

// import { ReserveScheduleComponent } from './section/reserve-schedule/reserve-schedule.component'

const routes: Routes = [
    {
        path: '',
        component: SaleComponent,
        children: [],
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SaleRoutingModule {}
