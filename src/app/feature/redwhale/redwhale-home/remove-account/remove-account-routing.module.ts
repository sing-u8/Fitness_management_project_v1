import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AuthGuard } from '@guards/auth.guard'

import { RemoveAccountComponent } from './remove-account/remove-account.component'
import { AccountRemovedComponent } from './account-removed/account-removed.component'

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: RemoveAccountComponent,
    },
    {
        path: 'remove-complete',
        component: AccountRemovedComponent,
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RemoveAccountRoutingModule {}
