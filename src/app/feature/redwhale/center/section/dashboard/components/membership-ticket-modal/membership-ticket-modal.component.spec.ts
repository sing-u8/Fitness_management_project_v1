import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MembershipTicketModalComponent } from './membership-ticket-modal.component'

describe('MembershipTicketModalComponent', () => {
    let component: MembershipTicketModalComponent
    let fixture: ComponentFixture<MembershipTicketModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MembershipTicketModalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(MembershipTicketModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
