import { NgModule } from '@angular/core'
import { CommonModule as AngularCommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'

import { MobileResetPasswordRoutingModule } from './mobile-reset-password-routing.module'

import { SharedModule } from '@shared/shared.module'

import { MobileResetPasswordComponent } from './mobile-reset-password.component'
import { TextFieldComponent } from './components/text-field/text-field.component'
import { ToastComponent } from './components/toast/toast.component'
import { ButtonComponent } from './components/button/button.component'

@NgModule({
    declarations: [MobileResetPasswordComponent, TextFieldComponent, ToastComponent, ButtonComponent],
    imports: [AngularCommonModule, MobileResetPasswordRoutingModule, ReactiveFormsModule, SharedModule],
})
export class MobileResetPasswordModule {}
