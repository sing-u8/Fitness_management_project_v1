import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LockerTipDropdownComponent } from './locker-tip-dropdown.component'

describe('LockerTipDropdownComponent', () => {
    let component: LockerTipDropdownComponent
    let fixture: ComponentFixture<LockerTipDropdownComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LockerTipDropdownComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(LockerTipDropdownComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
