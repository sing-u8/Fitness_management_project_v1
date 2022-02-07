import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { MypageComponent } from './mypage/mypage.component'

import { ExerciseJournalComponent } from './exercise-journal/exercise-journal.component'
import { SettingAccountComponent } from './setting-account/setting-account.component'
import { MembershipComponent } from './membership/membership.component'
import { ReservationComponent } from './reservation/reservation.component'

const routes: Routes = [
    {
        path: '',
        redirectTo: 'exercise-journal',
        pathMatch: 'full',
    },
    {
        path: '',
        component: MypageComponent,
        children: [
            { path: 'exercise-journal', component: ExerciseJournalComponent },
            { path: 'setting-account', component: SettingAccountComponent },
            { path: 'membership', component: MembershipComponent },
            { path: 'reservation', component: ReservationComponent },
        ],
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MypageRoutingModule {}
