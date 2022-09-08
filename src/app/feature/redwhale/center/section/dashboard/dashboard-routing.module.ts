import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { CommonModule as SecCommonModule } from '../common/common.module'

import { DashboardComponent } from './dashboard.component'

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [],
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes), SecCommonModule],
    exports: [RouterModule],
})
export class DashboardRoutingModule {}
