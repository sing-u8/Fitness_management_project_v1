import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CheckContractFullmodalComponent } from './check-contract-fullmodal.component'

describe('CheckContractFullmodalComponent', () => {
    let component: CheckContractFullmodalComponent
    let fixture: ComponentFixture<CheckContractFullmodalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CheckContractFullmodalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(CheckContractFullmodalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
