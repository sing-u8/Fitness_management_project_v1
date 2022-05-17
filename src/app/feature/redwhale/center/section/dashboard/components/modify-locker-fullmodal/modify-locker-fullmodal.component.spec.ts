import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModifyLockerFullmodalComponent } from './modify-locker-fullmodal.component'

describe('ModifyLockerFullmodalComponent', () => {
    let component: ModifyLockerFullmodalComponent
    let fixture: ComponentFixture<ModifyLockerFullmodalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModifyLockerFullmodalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(ModifyLockerFullmodalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
