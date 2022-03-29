import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModifyTicketStaffSelectComponent } from './modify-ticket-staff-select.component'

describe('ModifyLockerStaffSelectComponent', () => {
    let component: ModifyTicketStaffSelectComponent
    let fixture: ComponentFixture<ModifyTicketStaffSelectComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModifyTicketStaffSelectComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(ModifyTicketStaffSelectComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
