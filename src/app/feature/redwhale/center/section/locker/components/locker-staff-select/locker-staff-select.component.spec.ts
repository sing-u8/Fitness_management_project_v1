import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LockerStaffSelectComponent } from './locker-staff-select.component'

describe('LockerStaffSelectComponent', () => {
    let component: LockerStaffSelectComponent
    let fixture: ComponentFixture<LockerStaffSelectComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LockerStaffSelectComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(LockerStaffSelectComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
