import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PmLockerTicketWindowComponent } from './pm-locker-ticket-window.component'

describe('PmLockerTicketWindowComponent', () => {
    let component: PmLockerTicketWindowComponent
    let fixture: ComponentFixture<PmLockerTicketWindowComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PmLockerTicketWindowComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(PmLockerTicketWindowComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
