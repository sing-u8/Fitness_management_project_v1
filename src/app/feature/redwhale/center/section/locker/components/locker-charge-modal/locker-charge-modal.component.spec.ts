import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LockerChargeModalComponent } from './locker-charge-modal.component'

describe('LockerChargeModalComponent', () => {
    let component: LockerChargeModalComponent
    let fixture: ComponentFixture<LockerChargeModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LockerChargeModalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(LockerChargeModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
