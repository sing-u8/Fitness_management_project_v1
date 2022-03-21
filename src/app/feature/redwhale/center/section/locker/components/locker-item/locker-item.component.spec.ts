import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LockerItemComponent } from './locker-item.component'

describe('LockerItemComponent', () => {
    let component: LockerItemComponent
    let fixture: ComponentFixture<LockerItemComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LockerItemComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(LockerItemComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
