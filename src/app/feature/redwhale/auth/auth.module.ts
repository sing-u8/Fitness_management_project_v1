import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AuthRoutingModule } from "./auth-routing.module";
import { SharedModule } from "@shared/shared.module";
import { CommonModule as AngularCommonModule } from "@angular/common";

import { CommonModule } from "./common/common.module";

import { EmailLoginComponent } from "./emailLogin/emailLogin.component";
import { TermsComponent } from "./terms/terms.component";
import { TermsEULAComponent } from "./terms/modal/terms-eula/terms-eula.component";
import { TermsPrivacyComponent } from "./terms/modal/terms-privacy/terms-privacy.component";
import { LoginComponent } from "./login/login.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";

@NgModule({
  declarations: [
    EmailLoginComponent,
    TermsComponent,
    TermsEULAComponent,
    TermsPrivacyComponent,
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
  ],
  exports: [],
  providers: [],
})
export class AuthModule {}
