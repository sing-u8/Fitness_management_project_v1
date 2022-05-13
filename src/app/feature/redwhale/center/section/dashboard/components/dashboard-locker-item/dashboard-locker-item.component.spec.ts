import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DashboardLockerItemComponent } from './dashboard-locker-item.component'

describe('DashboardLockerItemComponent', () => {
    let component: DashboardLockerItemComponent
    let fixture: ComponentFixture<DashboardLockerItemComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardLockerItemComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardLockerItemComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
