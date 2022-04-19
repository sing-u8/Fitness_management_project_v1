import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SchGeneralModalComponent } from './sch-general-modal.component'

describe('SchGeneralModalComponent', () => {
    let component: SchGeneralModalComponent
    let fixture: ComponentFixture<SchGeneralModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SchGeneralModalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(SchGeneralModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
