import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MembershipTicketWindowComponent } from './membership-ticket-window.component'

describe('MembershipTicketWindowComponent', () => {
    let component: MembershipTicketWindowComponent
    let fixture: ComponentFixture<MembershipTicketWindowComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MembershipTicketWindowComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(MembershipTicketWindowComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
