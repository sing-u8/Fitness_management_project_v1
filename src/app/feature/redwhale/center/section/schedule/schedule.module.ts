import { NgModule } from '@angular/core'
import { CommonModule as AngularCommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { SharedModule } from '@shared/shared.module'

// components
import { ScheduleComponent } from './schedule.component'
import { SchInstructorDropdownComponent } from './components/sch-instructor-dropdown/sch-instructor-dropdown.component'
import { SchFilterDropdownComponent } from './components/sch-filter-dropdown/sch-filter-dropdown.component'
import { SchCenterOpratingModalComponent } from './components/sch-center-operating-modal/sch-center-operating-modal.component'
import { SchDeleteRepeatLessonModalComponent } from './components/sch-delete-repeat-lesson-modal/sch-delete-repeat-lesson-modal.component'
import { SchGeneralModalComponent } from './components/sch-general-modal/sch-general-modal.component'
import { SchLessonModalComponent } from './components/sch-lesson-modal/sch-lesson-modal.component'
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
        SchDeleteRepeatLessonModalComponent,
        SchGeneralModalComponent,
        SchModifyRepeatLessonModalComponent,
        SchLessonModalComponent,
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
