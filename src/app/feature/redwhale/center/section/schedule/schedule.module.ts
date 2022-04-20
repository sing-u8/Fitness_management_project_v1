import { NgModule } from '@angular/core'
import { CommonModule as AngularCommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { SharedModule } from '@shared/shared.module'

// components
import { ScheduleComponent } from './schedule.component'
import { SchInstructorDropdownComponent } from './components/sch-instructor-dropdown/sch-instructor-dropdown.component'
import { SchFilterDropdownComponent } from './components/sch-filter-dropdown/sch-filter-dropdown.component'
import { SchCenterOpratingModalComponent } from './components/sch-center-operating-modal/sch-center-operating-modal.component'
import { SchDayRepeatSelectComponent } from './components/sch-day-repeat-select/sch-day-repeat-select.component'
import { SchDeleteRepeatLessonModalComponent } from './components/sch-delete-repeat-lesson-modal/sch-delete-repeat-lesson-modal.component'
import { SchGeneralModalComponent } from './components/sch-general-modal/sch-general-modal.component'
import { SchModifyRepeatLessonModalComponent } from './components/sch-modify-repeat-lesson-modal/sch-modify-repeat-lesson-modal.component'

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
        SchDayRepeatSelectComponent,
        SchDeleteRepeatLessonModalComponent,
        SchGeneralModalComponent,
        SchModifyRepeatLessonModalComponent,
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
