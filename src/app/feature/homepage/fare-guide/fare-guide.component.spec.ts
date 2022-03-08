import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FareGuideComponent } from './fare-guide.component'

describe('FareGuideComponent', () => {
    let component: FareGuideComponent
    let fixture: ComponentFixture<FareGuideComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FareGuideComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(FareGuideComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
