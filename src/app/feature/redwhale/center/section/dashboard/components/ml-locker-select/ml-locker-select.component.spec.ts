import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MlLockerSelectComponent } from './ml-locker-select.component'

describe('MlLockerSelectComponent', () => {
    let component: MlLockerSelectComponent
    let fixture: ComponentFixture<MlLockerSelectComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MlLockerSelectComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(MlLockerSelectComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
