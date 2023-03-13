import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from '@guards/auth.guard'
import { CenterGuard } from '@guards/center.guard'
import { DashboardRegisterMlGuard } from '@guards/dashboard-register-ml.guard'
import { DashboardModifyLockerGuard } from '@guards/dashboard-modify-locker.guard'
import { DashboardModifyMembershipGuard } from '@guards/dashboard-modify-membership.guard'
import { DashboardTransferMembershipGuard } from '@guards/dashboard-transfer-membership.guard'
import { DashboardModifyPaymentGuard } from '@guards/dashboard-modify-payment.guard'
import { DashboardCheckContractGuard } from '@guards/dashboard-check-contract.guard'

import { NotFoundComponent } from './core/not-found/not-found.component'
import { RegisterMembershipLockerPageComponent } from '@redwhale/center/section/dashboard/register-membership-locker-page/register-membership-locker-page.component'
import { DirectRegisterMemberPageComponent } from '@redwhale/center/section/dashboard/direct-register-member-page/direct-register-member-page.component'
import { TransferMembershipPageComponent } from '@redwhale/center/section/dashboard/transfer-membership-page/transfer-membership-page.component'
import { ModifyMembershipPageComponent } from '@redwhale/center/section/dashboard/modify-membership-page/modify-membership-page.component'
import { ModifyLockerPageComponent } from '@redwhale/center/section/dashboard/modify-locker-page/modify-locker-page.component'
import { CheckContractPageComponent } from '@redwhale/center/section/dashboard/check-contract-page/check-contract-page.component'
import { ModifyPaymentPageComponent } from '@redwhale/center/section/dashboard/modify-payment-page/modify-payment-page.component'

const routes: Routes = [
    { path: '', loadChildren: () => import('./feature/homepage/homepage.module').then((m) => m.HomepageModule) },
    {
        path: 'components',
        loadChildren: () => import('./feature/component/components.module').then((m) => m.ComponentsModule),
    },
    {
        path: 'auth',
        loadChildren: () => import('./feature/redwhale/auth/auth.module').then((m) => m.AuthModule),
    },
    {
        path: 'redwhale-home',
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./feature/redwhale/redwhale-home/redwhale-home.module').then((m) => m.RedwhaleHomeModule),
    },
    {
        path: ':address/dashboard/register-member',
        canActivate: [AuthGuard, CenterGuard],
        component: DirectRegisterMemberPageComponent,
    },
    {
        path: ':address/dashboard/:id/register-membership-locker',
        canActivate: [DashboardRegisterMlGuard],
        component: RegisterMembershipLockerPageComponent,
    },
    {
        path: ':address/dashboard/:id/transfer-membership',
        canActivate: [DashboardTransferMembershipGuard],
        component: TransferMembershipPageComponent,
    },
    {
        path: ':address/dashboard/:id/modify-membership',
        canActivate: [DashboardModifyMembershipGuard],
        component: ModifyMembershipPageComponent,
    },
    {
        path: ':address/dashboard/:id/modify-locker',
        canActivate: [DashboardModifyLockerGuard],
        component: ModifyLockerPageComponent,
    },
    {
        path: ':address/dashboard/:id/check-contract',
        canActivate: [DashboardCheckContractGuard],
        component: CheckContractPageComponent,
    },
    {
        path: ':address/dashboard/:id/modify-payment',
        canActivate: [DashboardModifyPaymentGuard],
        component: ModifyPaymentPageComponent,
    },
    {
        path: ':address',
        canActivate: [AuthGuard, CenterGuard],
        loadChildren: () => import('./feature/redwhale/center/center.module').then((m) => m.CenterModule),
    },
    { path: '404', component: NotFoundComponent },
    { path: '**', redirectTo: '/404' },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
