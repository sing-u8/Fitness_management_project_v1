import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AccountRemovedComponent } from './account-removed.component'

describe('AccountRemovedComponent', () => {
    let component: AccountRemovedComponent
    let fixture: ComponentFixture<AccountRemovedComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AccountRemovedComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(AccountRemovedComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
