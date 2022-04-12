import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModifyLessonScheduleComponent } from './modify-lesson-schedule.component'

describe('ModifyLessonScheduleComponent', () => {
    let component: ModifyLessonScheduleComponent
    let fixture: ComponentFixture<ModifyLessonScheduleComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModifyLessonScheduleComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(ModifyLessonScheduleComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
