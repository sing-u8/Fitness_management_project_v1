import { NgModule } from '@angular/core'
import { RedwhaleHomeRoutingModule } from './redwhale-home-routing.module'
import { SharedModule } from '@shared/shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule as AngularCommonModule } from '@angular/common'

import { CommonModule } from '../common/common.module'

import { RedwhaleHomeComponent } from './redwhale-home.component'

import { CreateGymComponent } from './create-gym/create-gym.component'

import { CenterListSectionComponent } from './components/center-list-section/center-list-section.component'
import { CenterListItemComponent } from './components/center-list-item/center-list-item.component'
import { CenterPreviewItemComponent } from './components/center-preview-item/center-preview-item.component'
import { CreateCenterDirective } from './directives/create-center.directive'
import { SetCenterComponent } from './set-center/set-center.component'
import { FreeTrialModalComponent } from './components/free-trial-modal/free-trial-modal.component'

// ngxSkeletonLoader module
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'

@NgModule({
    declarations: [
        RedwhaleHomeComponent,
        CenterListSectionComponent,
        CenterListItemComponent,
        CreateGymComponent,
        CenterPreviewItemComponent,
        SetCenterComponent,
        FreeTrialModalComponent,

        // directive
        CreateCenterDirective,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        AngularCommonModule,
        RedwhaleHomeRoutingModule,
        SharedModule,
        CommonModule,
        NgxSkeletonLoaderModule,
    ],
    exports: [],
    providers: [],
})
export class RedwhaleHomeModule {}
