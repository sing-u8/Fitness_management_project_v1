import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModifyPaymentStatementComponent } from './modify-payment-statement.component'

describe('ModifyPaymentStatementComponent', () => {
    let component: ModifyPaymentStatementComponent
    let fixture: ComponentFixture<ModifyPaymentStatementComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModifyPaymentStatementComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(ModifyPaymentStatementComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
