import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LockerDetailBoxComponent } from './locker-detail-box.component'

describe('LockerDetailBoxComponent', () => {
    let component: LockerDetailBoxComponent
    let fixture: ComponentFixture<LockerDetailBoxComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LockerDetailBoxComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(LockerDetailBoxComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
