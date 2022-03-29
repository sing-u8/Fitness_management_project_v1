import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModifyLockerTicketComponent } from './modify-locker-ticket.component'

describe('ModifyLockerTicketComponent', () => {
    let component: ModifyLockerTicketComponent
    let fixture: ComponentFixture<ModifyLockerTicketComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModifyLockerTicketComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(ModifyLockerTicketComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
