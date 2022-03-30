import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DashboardReservationCardComponent } from './dashboard-reservation-card.component'

describe('DashboardReservationCardComponent', () => {
    let component: DashboardReservationCardComponent
    let fixture: ComponentFixture<DashboardReservationCardComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardReservationCardComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardReservationCardComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
