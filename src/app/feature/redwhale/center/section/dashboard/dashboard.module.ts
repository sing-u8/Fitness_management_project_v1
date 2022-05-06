import { NgModule } from '@angular/core'
import { CommonModule as AngularCommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { SharedModule } from '@shared/shared.module'

import { DashboardComponent } from './dashboard.component'

// components
import { MemberListComponent } from './components/member-list/member-list.component'
import { MembershipListComponent } from './components/membership-list/membership-list.component'
import { LockerLiistComponent } from './components/locker-liist/locker-liist.component'
import { ReservationListComponent } from './components/reservation-list/reservation-list.component'
import { PaymentListComponent } from './components/payment-list/payment-list.component'
import { MemberDetailComponent } from './components/member-detail/member-detail.component'
import { UserListSelectComponent } from './components/user-list-select/user-list-select.component'
import { UserListCardComponent } from './components/user-list-card/user-list-card.component'
import { UserFlipListComponent } from './components/user-flip-list/user-flip-list.component'
import { RegisterMemberModalComponent } from './components/register-member-modal/register-member-modal.component'
import { DirectRegisterMemberFullmodalComponent } from './components/direct-register-member-fullmodal/direct-register-member-fullmodal.component'
import { ChangeUserNameModalComponent } from './components/change-user-name-modal/change-user-name-modal.component'
import { UserDetailMembershipComponent } from './components/user-detail-membership/user-detail-membership.component'
import { UserDetailLockerComponent } from './components/user-detail-locker/user-detail-locker.component'
import { UserDetailReservationComponent } from './components/user-detail-reservation/user-detail-reservation.component'
import { UserDetailPaymentComponent } from './components/user-detail-payment/user-detail-payment.component'

import { RegisterMembershipLockerFullmodalComponent } from './components/register-membership-locker-fullmodal/register-membership-locker-fullmodal.component'
import { LockerWindowComponent } from './components/locker-window/locker-window.component'
import { MlStaffSelectorComponent } from './components/ml-staff-selector/ml-staff-selector.component'
import { MembershipTicketCardComponent } from './components/membership-ticket-card/membership-ticket-card.component'
import { MembershipTicketListModalComponent } from './components/membership-ticket-list-modal/membership-ticket-list-modal.component'
import { MlLockerItemComponent } from './components/ml-locker-item/ml-locker-item.component'
import { MlLockerSelectComponent } from './components/ml-locker-select/ml-locker-select.component'
import { LockerSelectModalComponent } from './components/locker-select-modal/locker-select-modal.component'
import { MembershipTicketWindowComponent } from './components/membership-ticket-window/membership-ticket-window.component'
import { LessonSelectorComponent } from './components/lesson-selector/lesson-selector.component'

// section module
import { CommonModule as SectionCommonModule } from '../common/common.module'

// ngxSkeletonLoader module
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'

@NgModule({
    declarations: [
        DashboardComponent,
        MemberListComponent,
        MembershipListComponent,
        LockerLiistComponent,
        ReservationListComponent,
        PaymentListComponent,
        MemberDetailComponent,
        UserListSelectComponent,
        UserListCardComponent,
        UserFlipListComponent,
        RegisterMemberModalComponent,
        DirectRegisterMemberFullmodalComponent,
        ChangeUserNameModalComponent,
        RegisterMembershipLockerFullmodalComponent,
        LockerWindowComponent,
        MlStaffSelectorComponent,
        MembershipTicketCardComponent,
        MembershipTicketListModalComponent,
        MlLockerItemComponent,
        MlLockerSelectComponent,
        LockerSelectModalComponent,
        MembershipTicketWindowComponent,
        LessonSelectorComponent,
        UserDetailMembershipComponent,
        UserDetailLockerComponent,
        UserDetailReservationComponent,
        UserDetailPaymentComponent,
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
