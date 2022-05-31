import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DashboardChargeModalComponent } from './dashboard-charge-modal.component'

describe('DashboardChargeModalComponent', () => {
    let component: DashboardChargeModalComponent
    let fixture: ComponentFixture<DashboardChargeModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardChargeModalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardChargeModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
