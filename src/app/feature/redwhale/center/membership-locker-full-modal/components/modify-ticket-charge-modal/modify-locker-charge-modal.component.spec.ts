import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModifyTicketChargeModalComponent } from './modify-ticket-charge-modal.component'

describe('ModifyLockerChargeModalComponent', () => {
    let component: ModifyTicketChargeModalComponent
    let fixture: ComponentFixture<ModifyTicketChargeModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModifyTicketChargeModalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(ModifyTicketChargeModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
