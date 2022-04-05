import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LockerDatepickerComponent } from './locker-datepicker.component'

describe('LockerDatepickerComponent', () => {
    let component: LockerDatepickerComponent
    let fixture: ComponentFixture<LockerDatepickerComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LockerDatepickerComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(LockerDatepickerComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
