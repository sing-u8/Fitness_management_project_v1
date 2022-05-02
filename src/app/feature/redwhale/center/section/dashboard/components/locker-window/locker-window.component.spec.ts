import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LockerWindowComponent } from './locker-window.component'

describe('LockerWindowComponent', () => {
    let component: LockerWindowComponent
    let fixture: ComponentFixture<LockerWindowComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LockerWindowComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(LockerWindowComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
