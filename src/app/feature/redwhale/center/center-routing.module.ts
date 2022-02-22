import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { CenterComponent } from './center.component'
import { DashboardComponent } from './section/dashboard/dashboard.component'
import { ScheduleComponent } from './section/schedule/schedule.component'
import { MembershipComponent } from './section/membership/membership.component'
import { LessonComponent } from './section/lesson/lesson.component'
import { LockerComponent } from './section/locker/locker.component'
import { CommunityComponent } from './section/community/community.component'
import { SaleComponent } from './section/sale/sale.component'
// import { ReserveScheduleComponent } from './section/reserve-schedule/reserve-schedule.component'
// import { TouchPadComponent } from './touch-pad/touch-pad.component'

import { CenterMemberBlockGuard } from '@guards/center-member-block.guard'

const routes: Routes = [
    {
        path: '',
        component: CenterComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent, canActivate: [CenterMemberBlockGuard] },
            { path: 'schedule', component: ScheduleComponent, canActivate: [CenterMemberBlockGuard] },
            { path: 'membership', component: MembershipComponent, canActivate: [CenterMemberBlockGuard] },
            { path: 'lesson', component: LessonComponent, canActivate: [CenterMemberBlockGuard] },
            { path: 'locker', component: LockerComponent, canActivate: [CenterMemberBlockGuard] },
            { path: 'community', component: CommunityComponent },
            { path: 'sale', component: SaleComponent, canActivate: [CenterMemberBlockGuard] },
            // { path: 'schedule-reservation', component: ReserveScheduleComponent },
        ],
    },
    // {
    //     path: 'dashboard/:membershipId',
    //     canActivate: [CenterMemberBlockGuard],
    //     loadChildren: () =>
    //         import('./membership-locker-full-modal/membership-locker-full-modal.module').then(
    //             (m) => m.MembershipLockerFullModalModule
    //         ),
    // },
    // {
    //     path: 'register-member',
    //     canActivate: [CenterMemberBlockGuard],
    //     loadChildren: () => import('./register-member/register-member.module').then((m) => m.RegisterMemberModule),
    // },
    // { path: 'touch-pad', component: TouchPadComponent, canActivate: [CenterMemberBlockGuard] },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GymRoutingModule {}
