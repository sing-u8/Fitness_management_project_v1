import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UserFlipListComponent } from './user-flip-list.component'

describe('UserFlipListComponent', () => {
    let component: UserFlipListComponent
    let fixture: ComponentFixture<UserFlipListComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserFlipListComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(UserFlipListComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
