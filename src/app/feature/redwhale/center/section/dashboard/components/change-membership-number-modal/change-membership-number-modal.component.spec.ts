import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ChangeMembershipNumberModalComponent } from './change-membership-number-modal.component'

describe('ChangeMembershipNumberModalComponent', () => {
    let component: ChangeMembershipNumberModalComponent
    let fixture: ComponentFixture<ChangeMembershipNumberModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChangeMembershipNumberModalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(ChangeMembershipNumberModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
