import { NgModule } from '@angular/core'
import { CommonModule as AngularCommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'

import { MobileResetPasswordRoutingModule } from './mobile-reset-password-routing.module'

import { SharedModule } from '@shared/shared.module'

import { MobileResetPasswordComponent } from './mobile-reset-password.component'
import { TextFieldComponent } from './components/text-field/text-field.component'
import { ToastComponent } from './components/toast/toast.component'

@NgModule({
    declarations: [MobileResetPasswordComponent, TextFieldComponent, ToastComponent],
    imports: [AngularCommonModule, MobileResetPasswordRoutingModule, ReactiveFormsModule, SharedModule],
})
export class MobileResetPasswordModule {}
