import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ChatRoomListDropdownComponent } from './chat-room-list-dropdown.component'

describe('ChatRoomListDropdownComponent', () => {
    let component: ChatRoomListDropdownComponent
    let fixture: ComponentFixture<ChatRoomListDropdownComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChatRoomListDropdownComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(ChatRoomListDropdownComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
