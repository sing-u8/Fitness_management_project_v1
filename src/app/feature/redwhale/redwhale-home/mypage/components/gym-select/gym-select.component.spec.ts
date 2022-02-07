import { ComponentFixture, TestBed } from '@angular/core/testing'

import { GymSelectComponent } from './gym-select.component'

describe('GymSelectComponent', () => {
    let component: GymSelectComponent
    let fixture: ComponentFixture<GymSelectComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GymSelectComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(GymSelectComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
