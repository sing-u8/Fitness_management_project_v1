import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LockerHistoryModalComponent } from './locker-history-modal.component'

describe('LockerHistoryModalComponent', () => {
    let component: LockerHistoryModalComponent
    let fixture: ComponentFixture<LockerHistoryModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LockerHistoryModalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(LockerHistoryModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
