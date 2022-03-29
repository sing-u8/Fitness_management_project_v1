import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RegisterMembershipLockerComponent } from './register-membership-locker.component'

describe('RegisterMembershipLockerComponent', () => {
    let component: RegisterMembershipLockerComponent
    let fixture: ComponentFixture<RegisterMembershipLockerComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RegisterMembershipLockerComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(RegisterMembershipLockerComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
