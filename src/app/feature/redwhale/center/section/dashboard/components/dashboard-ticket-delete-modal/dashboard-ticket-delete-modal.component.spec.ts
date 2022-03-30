import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DashboardTicketDeleteModalComponent } from './dashboard-ticket-delete-modal.component'

describe('DashboardTicketDeleteModalComponent', () => {
    let component: DashboardTicketDeleteModalComponent
    let fixture: ComponentFixture<DashboardTicketDeleteModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardTicketDeleteModalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardTicketDeleteModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
