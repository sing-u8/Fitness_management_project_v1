import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DashboardPaymentStatementCardComponent } from './dashboard-payment-statement-card.component'

describe('DashboardPaymentStatementCardComponent', () => {
    let component: DashboardPaymentStatementCardComponent
    let fixture: ComponentFixture<DashboardPaymentStatementCardComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardPaymentStatementCardComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardPaymentStatementCardComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
