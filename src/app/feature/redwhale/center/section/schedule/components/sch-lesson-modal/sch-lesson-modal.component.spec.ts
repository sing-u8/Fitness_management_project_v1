import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SchLessonModalComponent } from './sch-lesson-modal.component'

describe('SchLessonModalComponent', () => {
    let component: SchLessonModalComponent
    let fixture: ComponentFixture<SchLessonModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SchLessonModalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(SchLessonModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
