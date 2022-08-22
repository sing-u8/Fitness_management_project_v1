import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MsgMemberListComponent } from './msg-member-list.component'

describe('MemberListComponent', () => {
    let component: MsgMemberListComponent
    let fixture: ComponentFixture<MsgMemberListComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MsgMemberListComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(MsgMemberListComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
