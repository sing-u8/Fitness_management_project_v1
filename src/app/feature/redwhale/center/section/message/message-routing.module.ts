import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { MessageComponent } from './message.component'

// import { ReserveScheduleComponent } from './section/reserve-schedule/reserve-schedule.component'

const routes: Routes = [
    {
        path: '',
        component: MessageComponent,
        children: [],
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MessageRoutingModule {}
