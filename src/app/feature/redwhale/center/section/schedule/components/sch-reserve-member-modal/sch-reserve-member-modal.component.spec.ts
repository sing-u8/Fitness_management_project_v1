import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SchReserveMemberModalComponent } from './sch-reserve-member-modal.component'

describe('SchReserveMemberModalComponent', () => {
    let component: SchReserveMemberModalComponent
    let fixture: ComponentFixture<SchReserveMemberModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SchReserveMemberModalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(SchReserveMemberModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
