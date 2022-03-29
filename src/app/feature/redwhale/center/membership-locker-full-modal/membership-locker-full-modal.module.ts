import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'

import { MembershipLockerFullModalRoutingModule } from './membership-locker-full-modal-routing.module'
import { SharedModule } from '@shared/shared.module'
import { CommonModule } from '../../common/common.module'

import { MembershipTicketListModalComponent } from './components/membership-ticket-list-modal/membership-ticket-list-modal.component'
import { LockerSelectModalComponent } from './components/locker-select-modal/locker-select-modal.component'
import { MembershipTicketCardComponent } from './components/membership-ticket-card/membership-ticket-card.component'
import { MembershipTicketWindowComponent } from './components/membership-ticket-window/membership-ticket-window.component'
import { LockerWindowComponent } from './components/locker-window/locker-window.component'
import { LessonSelectorComponent } from './components/lesson-selector/lesson-selector.component'
import { MlStaffSelectorComponent } from './components/ml-staff-selector/ml-staff-selector.component'
import { MlLockerSelectComponent } from './components/ml-locker-select/ml-locker-select.component'
import { MlLockerItemComponent } from './components/ml-locker-item/ml-locker-item.component'

import { RegisterMembershipLockerComponent } from './register-membership-locker/register-membership-locker.component'
import { ModifyMembershipTicketComponent } from './modify-membership-ticket/modify-membership-ticket.component'
import { ModifyLockerTicketComponent } from './modify-locker-ticket/modify-locker-ticket.component'
import { ModifyPaymentStatementComponent } from './modify-payment-statement/modify-payment-statement.component'
import { ModifyTicketChargeModalComponent } from './components/modify-ticket-charge-modal/modify-ticket-charge-modal.component'
import { ModifyTicketStaffSelectComponent } from './components/modify-ticket-staff-select/modify-ticket-staff-select.component'
import { PmMembershipTicketWindowComponent } from './components/pm-membership-ticket-window/pm-membership-ticket-window.component'
import { PmLockerTicketWindowComponent } from './components/pm-locker-ticket-window/pm-locker-ticket-window.component'

@NgModule({
    declarations: [
        RegisterMembershipLockerComponent,
        MembershipTicketListModalComponent,
        LockerSelectModalComponent,
        MembershipTicketCardComponent,
        MembershipTicketWindowComponent,
        LockerWindowComponent,
        LessonSelectorComponent,
        MlStaffSelectorComponent,
        MlLockerSelectComponent,
        MlLockerItemComponent,
        ModifyMembershipTicketComponent,
        ModifyLockerTicketComponent,
        ModifyPaymentStatementComponent,
        ModifyTicketChargeModalComponent,
        ModifyTicketStaffSelectComponent,
        PmMembershipTicketWindowComponent,
        PmLockerTicketWindowComponent,
    ],
    imports: [MembershipLockerFullModalRoutingModule, SharedModule, CommonModule, ReactiveFormsModule],
})
export class MembershipLockerFullModalModule {}
