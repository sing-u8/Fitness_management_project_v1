import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LockerCategoryComponent } from './locker-category.component'

describe('LockerCategoryComponent', () => {
    let component: LockerCategoryComponent
    let fixture: ComponentFixture<LockerCategoryComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LockerCategoryComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(LockerCategoryComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
