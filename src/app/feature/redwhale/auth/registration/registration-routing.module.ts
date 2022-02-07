import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AuthGuard } from '@guards/auth.guard'
import { RegPhoneGuard } from '@guards/reg-phone.guard'
import { RegCompletedGuard } from '@guards/reg-completed.guard'

import { InfoComponent } from './info/info.component'
import { EmailComponent } from './email/email.component'
import { PhoneComponent } from './phone/phone.component'
import { CompletedComponent } from './completed/completed.component'

const routes: Routes = [
    { path: '', redirectTo: 'info', pathMatch: 'full' },
    { path: 'info', canActivate: [AuthGuard], component: InfoComponent },
    { path: 'email', canActivate: [AuthGuard], component: EmailComponent },
    { path: 'phone', canActivate: [RegPhoneGuard], component: PhoneComponent },
    { path: 'completed', canActivate: [RegCompletedGuard], component: CompletedComponent },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RegistrationRoutingModule {}
