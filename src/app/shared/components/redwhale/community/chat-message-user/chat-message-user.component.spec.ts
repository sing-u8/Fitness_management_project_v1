import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ChatMessageUserComponent } from './chat-message-user.component'

describe('ChatMessageUserComponent', () => {
    let component: ChatMessageUserComponent
    let fixture: ComponentFixture<ChatMessageUserComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChatMessageUserComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(ChatMessageUserComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
