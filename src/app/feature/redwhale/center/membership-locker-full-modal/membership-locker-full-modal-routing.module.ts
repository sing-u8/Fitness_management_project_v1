import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { RegisterMembershipLockerComponent } from './register-membership-locker/register-membership-locker.component'
import { ModifyLockerTicketComponent } from './modify-locker-ticket/modify-locker-ticket.component'
import { ModifyMembershipTicketComponent } from './modify-membership-ticket/modify-membership-ticket.component'
import { ModifyPaymentStatementComponent } from './modify-payment-statement/modify-payment-statement.component'

const routes: Routes = [
    {
        path: 'register-membership-locker',
        component: RegisterMembershipLockerComponent,
    },
    {
        path: 'modify-locker-ticket',
        component: ModifyLockerTicketComponent,
    },
    {
        path: 'modify-membership-ticket',
        component: ModifyMembershipTicketComponent,
    },
    {
        path: 'modify-payment-statement',
        component: ModifyPaymentStatementComponent,
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MembershipLockerFullModalRoutingModule {}
