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
import { TouchPadComponent } from './touch-pad/touch-pad.component'
// import { ReserveScheduleComponent } from './section/reserve-schedule/reserve-schedule.component'

import { CenterMemberBlockGuard } from '@guards/center-member-block.guard'

const routes: Routes = [
    {
        path: '',
        component: CenterComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                canActivate: [CenterMemberBlockGuard],
                loadChildren: () => import('./section/dashboard/dashboard.module').then((m) => m.DashboardModule),
            },
            {
                path: 'schedule',
                canActivate: [CenterMemberBlockGuard],
                loadChildren: () => import('./section/schedule/schedule.module').then((m) => m.ScheduleModule),
            },
            {
                path: 'membership',
                canActivate: [CenterMemberBlockGuard],
                loadChildren: () => import('./section/membership/membership.module').then((m) => m.MembershipModule),
            },
            {
                path: 'lesson',
                canActivate: [CenterMemberBlockGuard],
                loadChildren: () => import('./section/lesson/lesson.module').then((m) => m.LessonModule),
            },
            {
                path: 'locker',
                canActivate: [CenterMemberBlockGuard],
                loadChildren: () => import('./section/locker/locker.module').then((m) => m.LockerModule),
            },
            { path: 'community', component: CommunityComponent },
            {
                path: 'sale',
                canActivate: [CenterMemberBlockGuard],
                loadChildren: () => import('./section/sale/sale.module').then((m) => m.SaleModule),
            },
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
    {
        path: 'touch-pad',
        component: TouchPadComponent,
        canActivate: [CenterMemberBlockGuard],
    },
    // { path: 'touch-pad', component: TouchPadComponent, canActivate: [CenterMemberBlockGuard] },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GymRoutingModule {}
