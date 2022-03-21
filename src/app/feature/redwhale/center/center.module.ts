import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { CommonModule as AngularCommonModule } from '@angular/common'

import { GymRoutingModule } from './center-routing.module'
import { SharedModule } from '@shared/shared.module'
import { CommonModule } from '../common/common.module'

import { CenterComponent } from './center.component'
import { NavComponent } from './nav/nav.component'
import { DrawerModule } from './drawer/drawer.module'

// sections
import { CommunityComponent } from './section/community/community.component'
import { DashboardComponent } from './section/dashboard/dashboard.component'

import { SaleComponent } from './section/sale/sale.component'
import { ScheduleComponent } from './section/schedule/schedule.component'

// sections modules
import { LessonModule } from './section/lesson/lesson.module'
import { MembershipModule } from './section/membership/membership.module'
import { LockerModule } from './section/locker/locker.module'

// ngrx
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'

// -- // feature key
import { FeatureKey as GymFeatureKey } from '@centerStore/selectors/sec.selector'
import { FeatureKey as LessonFeatureKey } from '@centerStore/selectors/sec.lesson.selector'
import { FeatureKey as MembershipFeatureKey } from '@centerStore/selectors/sec.membership.selector'
import { FeatureKey as LockerFeatureKey } from '@centerStore/selectors/sec.locker.selector'

// - // states reducer and effect
import { lessonReducer } from '@centerStore/reducers/sec.lesson.reducer'
import { LessongEffect } from '@centerStore/effects/sec.lesson.effect'

import { membershipReducer } from '@centerStore/reducers/sec.membership.reducer'
import { membershipEffect } from '@centerStore/effects/sec.membership.effect'

import { lockerReducer } from '@centerStore/reducers/sec.locker.reducer'
import { LockerEffect } from '@centerStore/effects/sec.locker.effect'
// ! locker effect need to be add

@NgModule({
    declarations: [
        CenterComponent,
        NavComponent,

        // <-- sections //
        CommunityComponent,
        DashboardComponent,
        // LessonComponent,
        SaleComponent,
        ScheduleComponent,
        // sections --> //
    ],
    imports: [
        AngularCommonModule,
        GymRoutingModule,
        SharedModule,
        CommonModule,
        ReactiveFormsModule,
        DrawerModule,
        // sections modules
        LessonModule,
        MembershipModule,
        LockerModule,
        // <-- ngrx     //
        StoreModule.forFeature(GymFeatureKey, {
            [LessonFeatureKey]: lessonReducer,
            [MembershipFeatureKey]: membershipReducer,
            [LockerFeatureKey]: lockerReducer,
        }),
        EffectsModule.forFeature([LessongEffect, membershipEffect, LockerEffect]),
        // ngrx     --> //
    ],
    exports: [],
    providers: [],
})
export class CenterModule {}
