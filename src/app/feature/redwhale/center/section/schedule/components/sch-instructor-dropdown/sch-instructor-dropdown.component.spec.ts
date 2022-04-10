import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SchInstructorDropdownComponent } from './sch-instructor-dropdown.component'

describe('SchInstructorDropdownComponent', () => {
    let component: SchInstructorDropdownComponent
    let fixture: ComponentFixture<SchInstructorDropdownComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SchInstructorDropdownComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(SchInstructorDropdownComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
