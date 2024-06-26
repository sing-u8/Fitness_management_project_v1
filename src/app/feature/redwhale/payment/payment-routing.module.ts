import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { AuthGuard } from '@guards/auth.guard'

import { PaymentComponent } from './payment.component'

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: PaymentComponent,
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PaymentRoutingModule {}
