import { ComponentFixture, TestBed } from '@angular/core/testing'

import { GeneralScheduleComponent } from './general-schedule.component'

describe('GeneralScheduleComponent', () => {
    let component: GeneralScheduleComponent
    let fixture: ComponentFixture<GeneralScheduleComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GeneralScheduleComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(GeneralScheduleComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
