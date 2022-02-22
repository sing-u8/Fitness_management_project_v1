import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from '@guards/auth.guard'
import { CenterGuard } from '@guards/center.guard'

import { NotFoundComponent } from './core/not-found/not-found.component'

const routes: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
    { path: '/', redirectTo: 'auth', pathMatch: 'full' },
    {
        path: 'auth',
        loadChildren: () => import('./feature/redwhale/auth/auth.module').then((m) => m.AuthModule),
    },
    {
        path: 'redwhale-home',
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./feature/redwhale/redwhale-home/redwhale-home.module').then((m) => m.RedwhaleHomeModule),
    },
    {
        path: ':address',
        canActivate: [AuthGuard, CenterGuard],
        loadChildren: () => import('./feature/redwhale/gym/gym.module').then((m) => m.GymModule),
    },
    { path: '404', component: NotFoundComponent },
    { path: '**', redirectTo: '/404' },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
