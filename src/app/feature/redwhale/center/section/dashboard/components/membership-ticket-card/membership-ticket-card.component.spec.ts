import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MembershipTicketCardComponent } from './membership-ticket-card.component'

describe('MembershipTicketCardComponent', () => {
    let component: MembershipTicketCardComponent
    let fixture: ComponentFixture<MembershipTicketCardComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MembershipTicketCardComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(MembershipTicketCardComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
