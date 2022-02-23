import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AuthGuard } from '@guards/auth.guard'

import { RedwhaleHomeComponent } from './redwhale-home.component'
import { CreateGymComponent } from './create-gym/create-gym.component'
import { SetCenterComponent } from './set-center/set-center.component'

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: RedwhaleHomeComponent,
    },
    {
        path: 'create-center',
        canActivate: [AuthGuard],
        component: CreateGymComponent,
    },
    {
        path: 'set-center/:centerId',
        canActivate: [AuthGuard],
        component: SetCenterComponent,
    },
    {
        path: 'mypage',
        canActivate: [AuthGuard],
        loadChildren: () => import('./mypage/mypage.module').then((m) => m.MypageModule),
    },
    {
        path: 'remove-account',
        canActivate: [AuthGuard],
        loadChildren: () => import('./remove-account/remove-account.module').then((m) => m.RemoveAccountModule),
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RedwhaleHomeRoutingModule {}
