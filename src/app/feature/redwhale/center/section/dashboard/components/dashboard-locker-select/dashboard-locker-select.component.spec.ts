import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DashboardLockerSelectComponent } from './dashboard-locker-select.component'

describe('DashboardLockerSelectComponent', () => {
    let component: DashboardLockerSelectComponent
    let fixture: ComponentFixture<DashboardLockerSelectComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardLockerSelectComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardLockerSelectComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
