import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { MypageComponent } from './mypage/mypage.component'

import { SettingAccountComponent } from './setting-account/setting-account.component'

const routes: Routes = [
    {
        path: '',
        redirectTo: 'exercise-journal',
        pathMatch: 'full',
    },
    {
        path: '',
        component: MypageComponent,
        children: [{ path: 'setting-account', component: SettingAccountComponent }],
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MypageRoutingModule {}
