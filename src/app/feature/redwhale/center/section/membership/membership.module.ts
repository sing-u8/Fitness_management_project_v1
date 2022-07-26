import { NgModule } from '@angular/core'
import { CommonModule as AngularCommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { SharedModule } from '@shared/shared.module'

import { MembershipComponent } from './membership.component'

import { MembershipRoutingModule } from './membership-routing.module'

// components
import { MembershipCategoryComponent } from './components/membership-category/membership-category.component'

// section module
import { CommonModule as SectionCommonModule } from '@redwhale/center/section/common/common.module'

// ngxSkeletonLoader module
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'

@NgModule({
    declarations: [
        MembershipComponent,
        // components
        MembershipCategoryComponent,
    ],
    imports: [
        MembershipRoutingModule,
        AngularCommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NgxSkeletonLoaderModule,
        SectionCommonModule,
    ],
})
export class MembershipModule {}
