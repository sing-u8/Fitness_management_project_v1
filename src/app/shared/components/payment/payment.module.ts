import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { PaymentItemComponent } from './payment-item/payment-item.component'

@NgModule({
    declarations: [PaymentItemComponent],
    imports: [CommonModule],
    exports: [PaymentItemComponent],
})
export class PaymentModule {}
