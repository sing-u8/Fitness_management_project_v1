import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SchCenterOpratingModalComponent } from './sch-center-operating-modal.component'

describe('SchCenterOpratingModalComponent', () => {
    let component: SchCenterOpratingModalComponent
    let fixture: ComponentFixture<SchCenterOpratingModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SchCenterOpratingModalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(SchCenterOpratingModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
