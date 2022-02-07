import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TimePicker2Component } from './time-picker2.component'

describe('TimePicker2Component', () => {
    let component: TimePicker2Component
    let fixture: ComponentFixture<TimePicker2Component>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TimePicker2Component],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(TimePicker2Component)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
