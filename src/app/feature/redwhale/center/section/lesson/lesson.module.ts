import { NgModule } from '@angular/core'
import { CommonModule as AngularCommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { SharedModule } from '@shared/shared.module'

import { LessonComponent } from './lesson.component'

import { LessonRoutingModule } from './lesson-routing.module'

// components
import { LessonSelectComponent } from './components/lesson-select/lesson-select.component'
import { LessonCategoryComponent } from './components/lesson-category/lesson-category.component'
import { LessonIconComponent } from './components/lesson-icon/lesson-icon.component'

// section module
import { CommonModule as SectionCommonModule } from '../common/common.module'

// ngxSkeletonLoader module
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'

@NgModule({
    declarations: [
        LessonComponent,
        // components
        LessonSelectComponent,
        LessonCategoryComponent,
        LessonIconComponent,
    ],
    imports: [
        LessonRoutingModule,
        AngularCommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NgxSkeletonLoaderModule,
        SectionCommonModule,
    ],
})
export class LessonModule {}
