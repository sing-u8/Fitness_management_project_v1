import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LessonIconComponent } from './lesson-icon.component'

describe('LessonIconComponent', () => {
    let component: LessonIconComponent
    let fixture: ComponentFixture<LessonIconComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LessonIconComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(LessonIconComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
