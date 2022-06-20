import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MemberRoleSelectComponent } from './member-role-select.component'

describe('MemberRoleSelectComponent', () => {
    let component: MemberRoleSelectComponent
    let fixture: ComponentFixture<MemberRoleSelectComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MemberRoleSelectComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(MemberRoleSelectComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
