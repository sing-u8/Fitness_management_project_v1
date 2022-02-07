import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { GymComponent } from './gym.component'
import { DashboardComponent } from './section/dashboard/dashboard.component'
import { ScheduleComponent } from './section/schedule/schedule.component'
import { MembershipComponent } from './section/membership/membership.component'
import { LessonComponent } from './section/lesson/lesson.component'
import { LockerComponent } from './section/locker/locker.component'
import { CommunityComponent } from './section/community/community.component'
import { SaleComponent } from './section/sale/sale.component'
// import { ReserveScheduleComponent } from './section/reserve-schedule/reserve-schedule.component'
// import { TouchPadComponent } from './touch-pad/touch-pad.component'

import { GymMemberBlockGuard } from '@guards/gym-member-block.guard'

const routes: Routes = [
    {
        path: '',
        component: GymComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent, canActivate: [GymMemberBlockGuard] },
            { path: 'schedule', component: ScheduleComponent, canActivate: [GymMemberBlockGuard] },
            { path: 'membership', component: MembershipComponent, canActivate: [GymMemberBlockGuard] },
            { path: 'lesson', component: LessonComponent, canActivate: [GymMemberBlockGuard] },
            { path: 'locker', component: LockerComponent, canActivate: [GymMemberBlockGuard] },
            { path: 'community', component: CommunityComponent },
            { path: 'sale', component: SaleComponent, canActivate: [GymMemberBlockGuard] },
            // { path: 'schedule-reservation', component: ReserveScheduleComponent },
        ],
    },
    // {
    //     path: 'dashboard/:membershipId',
    //     canActivate: [GymMemberBlockGuard],
    //     loadChildren: () =>
    //         import('./membership-locker-full-modal/membership-locker-full-modal.module').then(
    //             (m) => m.MembershipLockerFullModalModule
    //         ),
    // },
    // {
    //     path: 'register-member',
    //     canActivate: [GymMemberBlockGuard],
    //     loadChildren: () => import('./register-member/register-member.module').then((m) => m.RegisterMemberModule),
    // },
    // { path: 'touch-pad', component: TouchPadComponent, canActivate: [GymMemberBlockGuard] },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GymRoutingModule {}
