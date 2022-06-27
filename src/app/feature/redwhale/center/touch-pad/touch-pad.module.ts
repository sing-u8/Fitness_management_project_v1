import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule as AngularCommonModule } from '@angular/common'

import { SharedModule } from '@shared/shared.module'

// components
import { AttendanceModalComponent } from './components/attendance-modal/attendance-modal.component'
import { TouchPadComponent } from './touch-pad.component'

@NgModule({
    declarations: [AttendanceModalComponent, TouchPadComponent],
    imports: [AngularCommonModule, ReactiveFormsModule, SharedModule, FormsModule],
})
export class TouchPadModule {}
