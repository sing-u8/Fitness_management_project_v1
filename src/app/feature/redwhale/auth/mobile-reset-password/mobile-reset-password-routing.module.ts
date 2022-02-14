import { NgModule } from "@angular/core";

import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "@guards/auth.guard";
import { MobileResetPasswordComponent } from "./mobile-reset-password.component";

const routes: Routes = [
  {
    path: "m.reset-password",
    canActivate: [AuthGuard],
    component: MobileResetPasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MobileResetPasswordRoutingModule {}
