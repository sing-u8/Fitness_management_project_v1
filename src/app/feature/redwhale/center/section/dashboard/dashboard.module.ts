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
