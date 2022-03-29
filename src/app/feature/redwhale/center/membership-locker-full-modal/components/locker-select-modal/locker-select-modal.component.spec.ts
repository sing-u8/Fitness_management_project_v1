import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LockerSelectModalComponent } from './locker-select-modal.component'

describe('LockerSelectModalComponent', () => {
    let component: LockerSelectModalComponent
    let fixture: ComponentFixture<LockerSelectModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LockerSelectModalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(LockerSelectModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
