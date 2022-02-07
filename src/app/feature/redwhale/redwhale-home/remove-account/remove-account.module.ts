import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { SharedModule } from '@shared/shared.module'

import { RemoveAccountRoutingModule } from './remove-account-routing.module'

import { AccountRemovedComponent } from './account-removed/account-removed.component'
import { RemoveAccountComponent } from './remove-account/remove-account.component'

import { RemoveAccountModalComponent } from './components/remove-account-modal/remove-account-modal.component'

@NgModule({
    declarations: [AccountRemovedComponent, RemoveAccountComponent, RemoveAccountModalComponent],
    imports: [CommonModule, FormsModule, RemoveAccountRoutingModule, SharedModule],
})
export class RemoveAccountModule {}
