import { ComponentFixture, TestBed } from '@angular/core/testing'

import { IntorductionInquiryComponent } from './intorduction-inquiry.component'

describe('IntorductionInquiryComponent', () => {
    let component: IntorductionInquiryComponent
    let fixture: ComponentFixture<IntorductionInquiryComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IntorductionInquiryComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(IntorductionInquiryComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
