import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AuthGuard } from '@guards/auth.guard'
import { TermsGuard } from '@guards/terms.guard'

import { LoginComponent } from './login/login.component'
import { TermsComponent } from './terms/terms.component'
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component'
import { ResetPasswordComponent } from './reset-password/reset-password.component'

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', canActivate: [AuthGuard], component: LoginComponent },
    { path: 'terms', canActivate: [TermsGuard], component: TermsComponent },
    {
        path: 'registration',
        loadChildren: () => import('./registration/registration.module').then((m) => m.RegistrationModule),
    },
    {
        path: 'forgot-password',
        canActivate: [AuthGuard],
        component: ForgotPasswordComponent,
    },
    {
        path: 'reset-password',
        canActivate: [AuthGuard],
        component: ResetPasswordComponent,
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {}
