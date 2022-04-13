import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FareGuideOptionTableComponent } from './fare-guide-option-table.component'

describe('FareGuideOptionTableComponent', () => {
    let component: FareGuideOptionTableComponent
    let fixture: ComponentFixture<FareGuideOptionTableComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FareGuideOptionTableComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(FareGuideOptionTableComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
