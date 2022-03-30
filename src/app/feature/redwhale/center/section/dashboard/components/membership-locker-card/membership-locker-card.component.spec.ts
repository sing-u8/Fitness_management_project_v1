import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MembershipLockerCardComponent } from './membership-locker-card.component'

describe('MembershipLockerCardComponent', () => {
    let component: MembershipLockerCardComponent
    let fixture: ComponentFixture<MembershipLockerCardComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MembershipLockerCardComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(MembershipLockerCardComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
