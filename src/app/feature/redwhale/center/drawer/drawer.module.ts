import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'

import { SharedModule } from '@shared/shared.module'

import { DrawerComponent } from './drawer.component'
import { MemberComponent } from './contents/member/member.component'
// import { CommunityComponent } from './contents/community/community.component'
import { NotificationComponent } from './contents/notification/notification.component'
import { GeneralScheduleComponent } from './contents/schedule/general-schedule/general-schedule.component'
import { LessonScheduleComponent } from './contents/schedule/lesson-schedule/lesson-schedule.component'
import { ModifyGeneralScheduleComponent } from './contents/schedule/modify-general-schedule/modify-general-schedule.component'
// import { ModifyLessonScheduleComponent } from './contents/schedule/modify-lesson-schedule/modify-lesson-schedule.component'

// ngxSkeletonLoader module
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'

@NgModule({
    declarations: [
        DrawerComponent,
        MemberComponent,
        // CommunityComponent,
        NotificationComponent,
        GeneralScheduleComponent,
        LessonScheduleComponent,
        ModifyGeneralScheduleComponent,
        // ModifyLessonScheduleComponent,
    ],
    imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule, NgxSkeletonLoaderModule],
    exports: [DrawerComponent, FormsModule],
    providers: [],
})
export class DrawerModule {}
