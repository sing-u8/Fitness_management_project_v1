import { NgModule } from '@angular/core'
import { CommonModule as AngularCommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { SharedModule } from '@shared/shared.module'

// components
import { LockerComponent } from './locker.component'
import { LockerDetailBoxComponent } from './components/locker-detail-box/locker-detail-box.component'
import { LockerTipDropdownComponent } from './components/locker-tip-dropdown/locker-tip-dropdown.component'

import { CommonModule as SectionCommonModule } from '@redwhale/center/section/common/common.module'

// ngxSkeletonLoader module
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'

@NgModule({
    declarations: [LockerComponent, LockerDetailBoxComponent, LockerTipDropdownComponent],
    imports: [
        AngularCommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NgxSkeletonLoaderModule,
        SectionCommonModule,
    ],
})
export class LockerModule {}