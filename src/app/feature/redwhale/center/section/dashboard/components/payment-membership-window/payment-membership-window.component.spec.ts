import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PaymentMembershipWindowComponent } from './payment-membership-window.component'

describe('PaymentMembershipWindowComponent', () => {
    let component: PaymentMembershipWindowComponent
    let fixture: ComponentFixture<PaymentMembershipWindowComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PaymentMembershipWindowComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(PaymentMembershipWindowComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
