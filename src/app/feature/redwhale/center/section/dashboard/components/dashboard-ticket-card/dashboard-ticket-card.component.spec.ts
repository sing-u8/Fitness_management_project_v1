import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DashboardTicketCardComponent } from './dashboard-ticket-card.component'

describe('DashboardTicketCardComponent', () => {
    let component: DashboardTicketCardComponent
    let fixture: ComponentFixture<DashboardTicketCardComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardTicketCardComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardTicketCardComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
