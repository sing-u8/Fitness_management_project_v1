import { NgModule } from '@angular/core'
import { CommonModule as AngularCommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { SharedModule } from '@shared/shared.module'

// components
import { LockerComponent } from './locker.component'
import { LockerDetailBoxComponent } from './components/locker-detail-box/locker-detail-box.component'
import { LockerTipDropdownComponent } from './components/locker-tip-dropdown/locker-tip-dropdown.component'
import { LockerCategoryComponent } from './components/locker-category/locker-category.component'
import { LockerItemComponent } from './components/locker-item/locker-item.component'
import { LockerStaffSelectComponent } from './components/locker-staff-select/locker-staff-select.component'
import { LockerChargeModalComponent } from './components/locker-charge-modal/locker-charge-modal.component'
import { RegisterLockerModalComponent } from './components/register-locker-modal/register-locker-modal.component'
import { EmptyLockerModalComponent } from './components/empty-locker-modal/empty-locker-modal.component'
import { LockerHistoryModalComponent } from './components/locker-history-modal/locker-history-modal.component'
import { LockerDatepickerComponent } from './components/locker-datepicker/locker-datepicker.component'

import { CommonModule as SectionCommonModule } from '@redwhale/center/section/common/common.module'

// ngxSkeletonLoader module
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'

@NgModule({
    declarations: [
        LockerComponent,
        LockerDetailBoxComponent,
        LockerTipDropdownComponent,
        LockerCategoryComponent,
        LockerItemComponent,
        LockerStaffSelectComponent,
        LockerChargeModalComponent,
        RegisterLockerModalComponent,
        EmptyLockerModalComponent,
        LockerHistoryModalComponent,
        LockerDatepickerComponent,
    ],
    imports: [
        AngularCommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NgxSkeletonLoaderModule,
        SectionCommonModule,
    ],
    providers: [],
})
export class LockerModule {}
