import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DrawerLessonCardComponent } from './drawer-lesson-card.component'

describe('DrawerLessonCardComponent', () => {
    let component: DrawerLessonCardComponent
    let fixture: ComponentFixture<DrawerLessonCardComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DrawerLessonCardComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawerLessonCardComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
