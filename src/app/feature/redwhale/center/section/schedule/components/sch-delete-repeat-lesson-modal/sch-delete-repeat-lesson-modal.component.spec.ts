import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SchDeleteRepeatLessonModalComponent } from './sch-delete-repeat-lesson-modal.component'

describe('SchDeleteRepeatLessonModalComponent', () => {
    let component: SchDeleteRepeatLessonModalComponent
    let fixture: ComponentFixture<SchDeleteRepeatLessonModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SchDeleteRepeatLessonModalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(SchDeleteRepeatLessonModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
