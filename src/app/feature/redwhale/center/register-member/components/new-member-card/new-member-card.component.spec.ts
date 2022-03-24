import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NewMemberCardComponent } from './new-member-card.component'

describe('NewMemberCardComponent', () => {
    let component: NewMemberCardComponent
    let fixture: ComponentFixture<NewMemberCardComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NewMemberCardComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(NewMemberCardComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
