import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule as AngularCommonModule } from '@angular/common'

import { SharedModule } from '@shared/shared.module'

// components
import { AttendanceModalComponent } from './components/attendance-modal/attendance-modal.component'
import { TouchPadComponent } from './touch-pad.component'
import { NgxSpinnerModule } from 'ngx-spinner';
import { EqualMembershipNumberModalComponent } from './components/equal-membership-number-modal/equal-membership-number-modal.component'

@NgModule({
    declarations: [AttendanceModalComponent, TouchPadComponent, EqualMembershipNumberModalComponent],
    imports: [AngularCommonModule, ReactiveFormsModule, SharedModule, FormsModule, NgxSpinnerModule],
})
export class TouchPadModule {}
