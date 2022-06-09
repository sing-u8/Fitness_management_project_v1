import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ChattingRoomCardComponent } from './chatting-room-card.component'

describe('ChattingRoomCardComponent', () => {
    let component: ChattingRoomCardComponent
    let fixture: ComponentFixture<ChattingRoomCardComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChattingRoomCardComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(ChattingRoomCardComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
