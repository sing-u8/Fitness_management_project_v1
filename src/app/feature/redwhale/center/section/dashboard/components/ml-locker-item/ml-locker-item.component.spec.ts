import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MlLockerItemComponent } from './ml-locker-item.component'

describe('MlLockerItemComponent', () => {
    let component: MlLockerItemComponent
    let fixture: ComponentFixture<MlLockerItemComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MlLockerItemComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(MlLockerItemComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
