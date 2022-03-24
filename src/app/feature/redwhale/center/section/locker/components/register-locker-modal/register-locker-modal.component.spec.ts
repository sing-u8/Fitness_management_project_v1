import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RegisterLockerModalComponent } from './register-locker-modal.component'

describe('RegisterLockerModalComponent', () => {
    let component: RegisterLockerModalComponent
    let fixture: ComponentFixture<RegisterLockerModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RegisterLockerModalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(RegisterLockerModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
