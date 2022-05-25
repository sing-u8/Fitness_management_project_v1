import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SaleSummaryBoxComponent } from './sale-summary-box.component'

describe('SaleSummaryBoxComponent', () => {
    let component: SaleSummaryBoxComponent
    let fixture: ComponentFixture<SaleSummaryBoxComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SaleSummaryBoxComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(SaleSummaryBoxComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
