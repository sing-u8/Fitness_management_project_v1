import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LockerShiftModalComponent } from './locker-shift-modal.component'

describe('LockerShiftModalComponent', () => {
    let component: LockerShiftModalComponent
    let fixture: ComponentFixture<LockerShiftModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LockerShiftModalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(LockerShiftModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
