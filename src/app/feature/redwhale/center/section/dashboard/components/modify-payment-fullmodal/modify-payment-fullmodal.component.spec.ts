import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModifyPaymentFullmodalComponent } from './modify-payment-fullmodal.component'

describe('ModifyPaymentFullmodalComponent', () => {
    let component: ModifyPaymentFullmodalComponent
    let fixture: ComponentFixture<ModifyPaymentFullmodalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModifyPaymentFullmodalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(ModifyPaymentFullmodalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
