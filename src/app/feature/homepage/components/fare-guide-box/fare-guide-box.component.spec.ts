import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FareGuideBoxComponent } from './fare-guide-box.component'

describe('FareGuideBoxComponent', () => {
    let component: FareGuideBoxComponent
    let fixture: ComponentFixture<FareGuideBoxComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FareGuideBoxComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(FareGuideBoxComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
