import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModifyMembershipTicketComponent } from './modify-membership-ticket.component'

describe('ModifyMembershipTicketComponent', () => {
    let component: ModifyMembershipTicketComponent
    let fixture: ComponentFixture<ModifyMembershipTicketComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModifyMembershipTicketComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(ModifyMembershipTicketComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
