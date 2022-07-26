import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { LessonComponent } from './lesson.component'

// import { ReserveScheduleComponent } from './section/reserve-schedule/reserve-schedule.component'

const routes: Routes = [
    {
        path: '',
        component: LessonComponent,
        children: [],
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LessonRoutingModule {}
