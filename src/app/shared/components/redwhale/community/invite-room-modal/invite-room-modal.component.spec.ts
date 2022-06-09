import { ComponentFixture, TestBed } from '@angular/core/testing'

import { InviteRoomModalComponent } from './invite-room-modal.component'

describe('InviteRoomModalComponent', () => {
    let component: InviteRoomModalComponent
    let fixture: ComponentFixture<InviteRoomModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InviteRoomModalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(InviteRoomModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
