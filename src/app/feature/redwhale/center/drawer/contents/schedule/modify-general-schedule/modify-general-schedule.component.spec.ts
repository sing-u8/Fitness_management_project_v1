import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModifyGeneralScheduleComponent } from './modify-general-schedule.component'

describe('ModifyGeneralScheduleComponent', () => {
    let component: ModifyGeneralScheduleComponent
    let fixture: ComponentFixture<ModifyGeneralScheduleComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModifyGeneralScheduleComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(ModifyGeneralScheduleComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
