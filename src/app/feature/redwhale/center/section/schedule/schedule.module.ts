import { NgModule } from '@angular/core'
import { CommonModule as AngularCommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { SharedModule } from '@shared/shared.module'

// components
import { ScheduleComponent } from './schedule.component'

// section module
import { CommonModule as SectionCommonModule } from '../common/common.module'

// ngxSkeletonLoader module
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'

@NgModule({
    declarations: [
        // components
        ScheduleComponent,
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
