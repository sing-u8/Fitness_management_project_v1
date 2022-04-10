import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SchFilterDropdownComponent } from './sch-filter-dropdown.component'

describe('SchFilterDropdownComponent', () => {
    let component: SchFilterDropdownComponent
    let fixture: ComponentFixture<SchFilterDropdownComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SchFilterDropdownComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(SchFilterDropdownComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
