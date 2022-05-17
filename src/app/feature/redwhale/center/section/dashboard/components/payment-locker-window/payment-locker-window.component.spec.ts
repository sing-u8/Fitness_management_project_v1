import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PaymentLockerWindowComponent } from './payment-locker-window.component'

describe('PaymentLockerWindowComponent', () => {
    let component: PaymentLockerWindowComponent
    let fixture: ComponentFixture<PaymentLockerWindowComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PaymentLockerWindowComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(PaymentLockerWindowComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
