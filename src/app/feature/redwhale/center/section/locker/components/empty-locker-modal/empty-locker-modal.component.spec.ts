import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EmptyLockerModalComponent } from './empty-locker-modal.component'

describe('EmptyLockerModalComponent', () => {
    let component: EmptyLockerModalComponent
    let fixture: ComponentFixture<EmptyLockerModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EmptyLockerModalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(EmptyLockerModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
