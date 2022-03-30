import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LockerTicketModalComponent } from './locker-ticket-modal.component'

describe('LockerTicketModalComponent', () => {
    let component: LockerTicketModalComponent
    let fixture: ComponentFixture<LockerTicketModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LockerTicketModalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(LockerTicketModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
