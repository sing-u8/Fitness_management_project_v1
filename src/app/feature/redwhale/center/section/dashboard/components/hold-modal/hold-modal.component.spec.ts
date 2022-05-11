import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HoldModalComponent } from './hold-modal.component'

describe('HoldModalComponent', () => {
    let component: HoldModalComponent
    let fixture: ComponentFixture<HoldModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HoldModalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(HoldModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
