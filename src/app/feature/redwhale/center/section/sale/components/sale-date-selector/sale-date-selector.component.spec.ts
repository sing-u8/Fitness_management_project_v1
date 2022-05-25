import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SaleDateSelectorComponent } from './sale-date-selector.component'

describe('SaleDateSelectorComponent', () => {
    let component: SaleDateSelectorComponent
    let fixture: ComponentFixture<SaleDateSelectorComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SaleDateSelectorComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(SaleDateSelectorComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
