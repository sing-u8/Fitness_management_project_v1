import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HoldAllModalComponent } from './hold-all-modal.component'

describe('HoldAllModalComponent', () => {
    let component: HoldAllModalComponent
    let fixture: ComponentFixture<HoldAllModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HoldAllModalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(HoldAllModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
