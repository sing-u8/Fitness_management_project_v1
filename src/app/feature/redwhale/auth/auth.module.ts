import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { AuthRoutingModule } from './auth-routing.module'
import { SharedModule } from '@shared/shared.module'
import { CommonModule as AngularCommonModule } from '@angular/common'

import { CommonModule } from './common/common.module'
import { MobileResetPasswordModule } from './mobile-reset-password/mobile-reset-password.module'

import { EmailLoginComponent } from './emailLogin/emailLogin.component'
import { TermsComponent } from './terms/terms.component'
import { LoginComponent } from './login/login.component'
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component'
import { ResetPasswordComponent } from './reset-password/reset-password.component'

@NgModule({
    declarations: [
        EmailLoginComponent,
        TermsComponent,
        LoginComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
    ],
    imports: [
        AngularCommonModule,
        AuthRoutingModule,
        SharedModule,
        CommonModule,
        FormsModule,
        MobileResetPasswordModule,
    ],
    exports: [],
    providers: [],
})
export class AuthModule {}
