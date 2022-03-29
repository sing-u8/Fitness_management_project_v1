import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PmMembershipTicketWindowComponent } from './pm-membership-ticket-window.component'

describe('PmMembershipTicketWindowComponent', () => {
    let component: PmMembershipTicketWindowComponent
    let fixture: ComponentFixture<PmMembershipTicketWindowComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PmMembershipTicketWindowComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(PmMembershipTicketWindowComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
