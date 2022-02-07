import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from '@guards/auth.guard'
import { GymGuard } from '@guards/gym.guard'

import { NotFoundComponent } from './core/not-found/not-found.component'

const routes: Routes = [
    { path: '', redirectTo: '/', pathMatch: 'full' },
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
        canActivate: [AuthGuard, GymGuard],
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
