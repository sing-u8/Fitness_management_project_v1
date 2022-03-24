import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { RegisterMemberComponent } from './register-member.component'
import { DirectRegistrationComponent } from './direct-registration/direct-registration.component'

const routes: Routes = [
    {
        path: '',
        redirectTo: 'main-registration',
        pathMatch: 'full',
    },
    {
        path: 'main-registration',
        component: RegisterMemberComponent,
    },
    {
        path: 'direct-registration',
        component: DirectRegistrationComponent,
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RegisterMemberRoutingModule {}
