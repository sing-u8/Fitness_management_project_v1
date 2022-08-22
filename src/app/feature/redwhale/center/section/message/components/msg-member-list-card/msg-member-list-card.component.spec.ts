import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MsgMemberListCardComponent } from './msg-member-list-card.component'

describe('MemberListCardComponent', () => {
    let component: MsgMemberListCardComponent
    let fixture: ComponentFixture<MsgMemberListCardComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MsgMemberListCardComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(MsgMemberListCardComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
