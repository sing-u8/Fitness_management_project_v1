import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { SharedModule } from '@shared/shared.module'

import { MypageRoutingModule } from './mypage-routing.module'

import { MypageComponent } from './mypage/mypage.component'
import { ExerciseJournalComponent } from './exercise-journal/exercise-journal.component'
import { SettingAccountComponent } from './setting-account/setting-account.component'
import { MembershipComponent } from './membership/membership.component'
import { ReservationComponent } from './reservation/reservation.component'

import { SettingModalComponent } from './components/setting-modal/setting-modal.component'
import { DelAvatarModalComponent } from './components/del-avatar-modal/del-avatar-modal.component'
import { CertificationSettingModalComponent } from './components/certification-setting-modal/certification-setting-modal.component'
import { ChangePasswordModalComponent } from './components/change-password-modal/change-password-modal.component'
import { GymSelectComponent } from './components/gym-select/gym-select.component'

@NgModule({
    declarations: [
        MypageComponent,
        ExerciseJournalComponent,
        SettingAccountComponent,
        MembershipComponent,
        ReservationComponent,
        SettingModalComponent,
        DelAvatarModalComponent,
        CertificationSettingModalComponent,
        ChangePasswordModalComponent,
        GymSelectComponent,
    ],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MypageRoutingModule, SharedModule],
    exports: [],
})
export class MypageModule {}
