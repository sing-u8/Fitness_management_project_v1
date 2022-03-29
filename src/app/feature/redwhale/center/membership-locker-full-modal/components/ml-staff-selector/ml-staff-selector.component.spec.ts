import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MlStaffSelectorComponent } from './ml-staff-selector.component'

describe('MlStaffSelectorComponent', () => {
    let component: MlStaffSelectorComponent
    let fixture: ComponentFixture<MlStaffSelectorComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MlStaffSelectorComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(MlStaffSelectorComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
