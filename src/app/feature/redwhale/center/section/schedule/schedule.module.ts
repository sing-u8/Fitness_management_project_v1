import { NgModule } from '@angular/core'
import { CommonModule as AngularCommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { SharedModule } from '@shared/shared.module'

// components
import { ScheduleComponent } from './schedule.component'
import { SchInstructorDropdownComponent } from './components/sch-instructor-dropdown/sch-instructor-dropdown.component'
import { SchFilterDropdownComponent } from './components/sch-filter-dropdown/sch-filter-dropdown.component'
import { SchCenterOpratingModalComponent } from './components/sch-center-operating-modal/sch-center-operating-modal.component'

// section module
import { CommonModule as SectionCommonModule } from '../common/common.module'

// ngxSkeletonLoader module
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'

@NgModule({
    declarations: [
        // components
        ScheduleComponent,
        SchInstructorDropdownComponent,
        SchFilterDropdownComponent,
        SchCenterOpratingModalComponent,
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
export class ScheduleModule {}
