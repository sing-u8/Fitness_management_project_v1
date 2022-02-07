import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AuthGuard } from '@guards/auth.guard'

import { RedwhaleHomeComponent } from './redwhale-home.component'
import { CreateGymComponent } from './create-gym/create-gym.component'

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: RedwhaleHomeComponent,
    },
    {
        path: 'create-gym',
        canActivate: [AuthGuard],
        component: CreateGymComponent,
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
