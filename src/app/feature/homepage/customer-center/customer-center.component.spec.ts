import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CustomerCenterComponent } from './customer-center.component'

describe('CustomerCenterComponent', () => {
    let component: CustomerCenterComponent
    let fixture: ComponentFixture<CustomerCenterComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CustomerCenterComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomerCenterComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
