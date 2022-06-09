import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MultiAvatarComponent } from './multi-avatar.component'

describe('MultiAvatarComponent', () => {
    let component: MultiAvatarComponent
    let fixture: ComponentFixture<MultiAvatarComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MultiAvatarComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(MultiAvatarComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
