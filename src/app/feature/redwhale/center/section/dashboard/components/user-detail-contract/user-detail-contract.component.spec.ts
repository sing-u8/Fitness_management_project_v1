import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UserDetailContractComponent } from './user-detail-contract.component'

describe('UserDetailContractComponent', () => {
    let component: UserDetailContractComponent
    let fixture: ComponentFixture<UserDetailContractComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserDetailContractComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(UserDetailContractComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
