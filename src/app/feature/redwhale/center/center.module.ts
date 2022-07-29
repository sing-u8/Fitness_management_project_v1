import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { CommonModule as AngularCommonModule } from '@angular/common'

import { GymRoutingModule } from './center-routing.module'
import { SharedModule } from '@shared/shared.module'
import { CommonModule } from '../common/common.module'

import { CenterComponent } from './center.component'
import { NavComponent } from './nav/nav.component'
import { DrawerModule } from './drawer/drawer.module'
import { TouchPadModule } from './touch-pad/touch-pad.module'

// sections
import { CommunityComponent } from './section/community/community.component'

// sections modules
import { LessonModule } from './section/lesson/lesson.module'
import { MembershipModule } from './section/membership/membership.module'
import { LockerModule } from './section/locker/locker.module'
import { ScheduleModule } from './section/schedule/schedule.module'
import { DashboardModule } from './section/dashboard/dashboard.module'
import { SaleModule } from './section/sale/sale.module'

// ngrx
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'

// -- // feature key
import { FeatureKey as GymFeatureKey } from '@centerStore/selectors/sec.selector'
import { FeatureKey as LessonFeatureKey } from '@centerStore/selectors/sec.lesson.selector'
import { FeatureKey as MembershipFeatureKey } from '@centerStore/selectors/sec.membership.selector'
import { FeatureKey as LockerFeatureKey } from '@centerStore/selectors/sec.locker.selector'
import { FeatureKey as DashboardFeatureKey } from '@centerStore/selectors/sec.dashoboard.selector'
import { FeatureKey as ScheduleFeatureKey } from '@centerStore/selectors/sec.schedule.selector'
import { FeatureKey as SaleFeatureKey } from '@centerStore/selectors/sec.sale.selector'
import { FeatureKey as CommunityFeatureKey } from '@centerStore/selectors/sec.community.selector'
import { FeatureKey as CenterCommonFeatureKey } from '@centerStore/selectors/center.common.selector'

// - // states reducer and effect
import { lessonReducer } from '@centerStore/reducers/sec.lesson.reducer'
import { LessonEffect } from '@centerStore/effects/sec.lesson.effect'

import { membershipReducer } from '@centerStore/reducers/sec.membership.reducer'
import { MembershipEffect } from '@centerStore/effects/sec.membership.effect'

import { lockerReducer } from '@centerStore/reducers/sec.locker.reducer'
import { LockerEffect } from '@centerStore/effects/sec.locker.effect'

import { dashboardReducer } from '@centerStore/reducers/sec.dashboard.reducer'
import { DashboardEffect } from '@centerStore/effects/sec.dashboard.effect'

import { scheduleReducer } from '@centerStore/reducers/sec.schedule.reducer'
import { ScheduleEffect } from '@centerStore/effects/sec.schedule.effect'

import { saleReducer } from '@centerStore/reducers/sec.sale.reducer'
import { SaleEffect } from '@centerStore/effects/sec.sale.effect'

import { communityReducer } from '@centerStore/reducers/sec.community.reducer'
import { CommunityEffect } from '@centerStore/effects/sec.community.effect'

import { centerCommonReducer } from '@centerStore/reducers/center.common.reducer'
import { CenterCommonEffect } from '@centerStore/effects/center.common.effect'

@NgModule({
    declarations: [
        CenterComponent,
        NavComponent,

        // <-- sections //
        CommunityComponent,
        // sections --> //
    ],
    imports: [
        AngularCommonModule,
        GymRoutingModule,
        SharedModule,
        CommonModule,
        ReactiveFormsModule,
        DrawerModule,
        TouchPadModule,
        // sections modules
        LessonModule,
        MembershipModule,
        LockerModule,
        ScheduleModule,
        DashboardModule,
        SaleModule,
        // <-- ngrx     //
        StoreModule.forFeature(GymFeatureKey, {
            [LessonFeatureKey]: lessonReducer,
            [MembershipFeatureKey]: membershipReducer,
            [LockerFeatureKey]: lockerReducer,
            [DashboardFeatureKey]: dashboardReducer,
            [ScheduleFeatureKey]: scheduleReducer,
            [SaleFeatureKey]: saleReducer,
            [CommunityFeatureKey]: communityReducer,
            [CenterCommonFeatureKey]: centerCommonReducer,
        }),
        EffectsModule.forFeature([
            LessonEffect,
            MembershipEffect,
            LockerEffect,
            ScheduleEffect,
            DashboardEffect,
            SaleEffect,
            CommunityEffect,
            CenterCommonEffect,
        ]),
        // ngrx     --> //
    ],
    exports: [],
    providers: [],
})
export class CenterModule {}
