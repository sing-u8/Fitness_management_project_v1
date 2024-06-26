import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { CenterComponent } from './center.component'
import { CommunityComponent } from './section/community/community.component'
import { TouchPadComponent } from './touch-pad/touch-pad.component'
import { RegisterMembershipLockerPageComponent } from './section/dashboard/register-membership-locker-page/register-membership-locker-page.component'

import { CenterMemberBlockGuard } from '@guards/center-member-block.guard'
import { CenterSaleGuard } from '@guards/center-sale.guard'
import { DashboardRegisterMlGuard } from '@guards/dashboard-register-ml.guard'

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
                canActivate: [CenterMemberBlockGuard, CenterSaleGuard],
                loadChildren: () => import('./section/sale/sale.module').then((m) => m.SaleModule),
            },
            {
                path: 'message',
                canActivate: [CenterMemberBlockGuard],
                loadChildren: () => import('./section/message/message.module').then((m) => m.MessageModule),
            },
        ],
    },
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
