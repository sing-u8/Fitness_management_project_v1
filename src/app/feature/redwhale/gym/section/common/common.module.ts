import { NgModule } from '@angular/core'

import { SharedModule } from '@shared/shared.module'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { CommonModule as AngularCommonModule } from '@angular/common'

// components
import { LessonCardComponent } from './components/lesson-card/lesson-card.component'
import { MembershipCardComponent } from './components/membership-card/membership-card.component'

@NgModule({
    declarations: [LessonCardComponent, MembershipCardComponent],
    imports: [SharedModule, AngularCommonModule, ReactiveFormsModule, FormsModule],
    exports: [LessonCardComponent, MembershipCardComponent],
    providers: [],
})
export class CommonModule {}
