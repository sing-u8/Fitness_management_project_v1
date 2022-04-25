import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LockerLiistComponent } from './locker-liist.component'

describe('LockerLiistComponent', () => {
    let component: LockerLiistComponent
    let fixture: ComponentFixture<LockerLiistComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LockerLiistComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(LockerLiistComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
