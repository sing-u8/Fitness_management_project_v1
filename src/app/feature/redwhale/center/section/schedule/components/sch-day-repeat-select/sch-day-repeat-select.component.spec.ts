import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SchDayRepeatSelectComponent } from './sch-day-repeat-select.component'

describe('SchDayRepeatSelectComponent', () => {
    let component: SchDayRepeatSelectComponent
    let fixture: ComponentFixture<SchDayRepeatSelectComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SchDayRepeatSelectComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(SchDayRepeatSelectComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
