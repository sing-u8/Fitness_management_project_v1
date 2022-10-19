import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule as AngularCommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { SharedModule } from '@shared/shared.module'

import { DashboardComponent } from './dashboard.component'

// components
import { MemberListComponent } from './components/member-list/member-list.component'
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
import { UserDetailMembershipItemComponent } from './components/user-detail-membership-item/user-detail-membership-item.component'
import { UserDetailLockerItemComponent } from './components/user-detail-locker-item/user-detail-locker-item.component'
import { UserDetailReservationItemComponent } from './components/user-detail-reservation-item/user-detail-reservation-item.component'
import { UserDetailPaymentItemComponent } from './components/user-detail-payment-item/user-detail-payment-item.component'
import { MembershipExtensionModalComponent } from './components/membership-extension-modal/membership-extension-modal.component'
import { LockerExtensionModalComponent } from './components/locker-extension-modal/locker-extension-modal.component'
import { HoldModalComponent } from './components/hold-modal/hold-modal.component'
import { DashboardLockerItemComponent } from './components/dashboard-locker-item/dashboard-locker-item.component'

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
import { ModifyMembershipFullmodalComponent } from './components/modify-membership-fullmodal/modify-membership-fullmodal.component'
import { ModifyLockerFullmodalComponent } from './components/modify-locker-fullmodal/modify-locker-fullmodal.component'
import { LockerShiftModalComponent } from './components/locker-shift-modal/locker-shift-modal.component'
import { ModifyPaymentFullmodalComponent } from './components/modify-payment-fullmodal/modify-payment-fullmodal.component'
import { PaymentLockerWindowComponent } from './components/payment-locker-window/payment-locker-window.component'
import { PaymentMembershipWindowComponent } from './components/payment-membership-window/payment-membership-window.component'
import { DashboardChargeModalComponent } from './components/dashboard-charge-modal/dashboard-charge-modal.component'
import { MemberRoleSelectComponent } from './components/member-role-select/member-role-select.component'
import { UserDetailContractComponent } from './components/user-detail-contract/user-detail-contract.component'
import { UserDetailContractItemComponent } from './components/user-detail-contract-item/user-detail-contract-item.component'
import { HoldAllModalComponent } from './components/hold-all-modal/hold-all-modal.component'
import { ContractSignBoxComponent } from './components/contract-sign-box/contract-sign-box.component'
import { MembershipTicketWindowRegisteredComponent } from './components/membership-ticket-window-registered/membership-ticket-window-registered.component'
import { LockerWindowRegisteredComponent } from './components/locker-window-registered/locker-window-registered.component'
import { CheckContractFullmodalComponent } from './components/check-contract-fullmodal/check-contract-fullmodal.component'
import { ChangeMembershipNumberModalComponent } from './components/change-membership-number-modal/change-membership-number-modal.component'
import { DetailItemRemoveModalComponent } from './components/detail-item-remove-modal/detail-item-remove-modal.component'
// // drawer
import { DwMemberListComponent } from './components/dw-member-list/dw-member-list.component'

import { DashboardRoutingModule } from './dashboard-routing.module'

// section module
import { CommonModule as SectionCommonModule } from '../common/common.module'

// ngxSkeletonLoader module
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'
import { NgxSpinnerModule } from 'ngx-spinner'

@NgModule({
    declarations: [
        DashboardComponent,
        MemberListComponent,
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
        UserDetailMembershipItemComponent,
        UserDetailLockerItemComponent,
        UserDetailReservationItemComponent,
        UserDetailPaymentItemComponent,
        ModifyMembershipFullmodalComponent,
        ModifyLockerFullmodalComponent,
        MembershipExtensionModalComponent,
        LockerExtensionModalComponent,
        HoldModalComponent,
        LockerShiftModalComponent,
        DashboardLockerItemComponent,
        ModifyPaymentFullmodalComponent,
        PaymentLockerWindowComponent,
        PaymentMembershipWindowComponent,
        DashboardChargeModalComponent,
        MemberRoleSelectComponent,
        UserDetailContractComponent,
        UserDetailContractItemComponent,
        HoldAllModalComponent,
        ContractSignBoxComponent,
        MembershipTicketWindowRegisteredComponent,
        LockerWindowRegisteredComponent,
        CheckContractFullmodalComponent,
        DwMemberListComponent,
        ChangeMembershipNumberModalComponent,
        DetailItemRemoveModalComponent,
    ],
    imports: [
        DashboardRoutingModule,
        AngularCommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NgxSkeletonLoaderModule,
        SectionCommonModule,
        NgxSpinnerModule,
    ],
    exports: [
        RegisterMemberModalComponent,
        DirectRegisterMemberFullmodalComponent,
        RegisterMembershipLockerFullmodalComponent,
        MemberListComponent,
        DwMemberListComponent,
        ChangeUserNameModalComponent,
        MemberRoleSelectComponent,
        ChangeMembershipNumberModalComponent,
    ],
    schemas: [],
})
export class DashboardModule {}
