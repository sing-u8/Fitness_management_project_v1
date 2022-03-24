import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'

import { SharedModule } from '@shared/shared.module'

import { RegisterMemberRoutingModule } from './register-member-routing.module'
import { RegisterMemberComponent } from './register-member.component'
import { DirectRegistrationComponent } from './direct-registration/direct-registration.component'
import { NewMemberCardComponent } from './components/new-member-card/new-member-card.component'

@NgModule({
    declarations: [RegisterMemberComponent, DirectRegistrationComponent, NewMemberCardComponent],
    imports: [CommonModule, RegisterMemberRoutingModule, ReactiveFormsModule, SharedModule],
})
export class RegisterMemberModule {}
