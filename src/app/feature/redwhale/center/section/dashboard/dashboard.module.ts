import { NgModule } from '@angular/core'
import { CommonModule as AngularCommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { SharedModule } from '@shared/shared.module'

import { DashboardComponent } from './dashboard.component'

// components
import { ChangeUserNameModalComponent } from './components/change-user-name-modal/change-user-name-modal.component'
import { DashboardLockerItemComponent } from './components/dashboard-locker-item/dashboard-locker-item.component'
import { DashboardLockerSelectComponent } from './components/dashboard-locker-select/dashboard-locker-select.component'
import { LockerShiftModalComponent } from './components/locker-shift-modal/locker-shift-modal.component'
import { MemberRoleSelectComponent } from './components/member-role-select/member-role-select.component'
import { MembershipLockerCardComponent } from './components/membership-locker-card/membership-locker-card.component'
import { UserFlipListComponent } from './components/user-flip-list/user-flip-list.component'
import { UserListSelectComponent } from './components/user-list-select/user-list-select.component'

// import { DashboardPaymentStatementCardComponent } from './components/dashboard-payment-statement-card/dashboard-payment-statement-card.component'
// import { DashboardTicketCardComponent } from './components/dashboard-ticket-card/dashboard-ticket-card.component'
// import { HoldAllModalComponent } from './components/hold-all-modal/hold-all-modal.component'
// import { LockerTicketModalComponent } from './components/locker-ticket-modal/locker-ticket-modal.component'
// import { MembershipTicketModalComponent } from './components/membership-ticket-modal/membership-ticket-modal.component'
// import { UserListCardComponent } from './components/user-list-card/user-list-card.component'

// section module
import { CommonModule as SectionCommonModule } from '@redwhale/center/section/common/common.module'

// ngxSkeletonLoader module
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'

@NgModule({
    declarations: [
        DashboardComponent,
        // components
        ChangeUserNameModalComponent,
        DashboardLockerItemComponent,
        DashboardLockerSelectComponent,
        LockerShiftModalComponent,
        MemberRoleSelectComponent,
        MembershipLockerCardComponent,
        UserFlipListComponent,
        UserListSelectComponent,
    ],
    imports: [
        AngularCommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NgxSkeletonLoaderModule,
        SectionCommonModule,
    ],
})
export class DashboardModule {}
