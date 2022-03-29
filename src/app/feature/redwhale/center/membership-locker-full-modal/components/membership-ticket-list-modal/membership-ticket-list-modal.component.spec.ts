import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MembershipTicketListModalComponent } from './membership-ticket-list-modal.component'

describe('MembershipTicketListModalComponent', () => {
    let component: MembershipTicketListModalComponent
    let fixture: ComponentFixture<MembershipTicketListModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MembershipTicketListModalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(MembershipTicketListModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
