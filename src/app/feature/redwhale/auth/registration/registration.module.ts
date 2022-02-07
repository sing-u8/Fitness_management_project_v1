import { NgModule } from '@angular/core'
import { CommonModule as AngularCommonModule } from '@angular/common'

import { RegistrationRoutingModule } from './registration-routing.module'
import { SharedModule } from '@shared/shared.module'
import { FormsModule } from '@angular/forms'

import { CommonModule } from '../common/common.module'

import { InfoComponent } from './info/info.component'
import { EmailComponent } from './email/email.component'
import { PhoneComponent } from './phone/phone.component'
import { CompletedComponent } from './completed/completed.component'

@NgModule({
    declarations: [InfoComponent, EmailComponent, PhoneComponent, CompletedComponent],
    imports: [FormsModule, AngularCommonModule, RegistrationRoutingModule, SharedModule, CommonModule],
    exports: [],
    providers: [],
})
export class RegistrationModule {}
